import { PublishCommand } from "@aws-sdk/client-sns";
import { HeadObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3Client";
import { sns } from "../lib/snsClient";
import { ISaleNote } from "../interfaces/ISaleNote";

export async function notifyClientSNS(notaVenta: ISaleNote) {
  const bucketName = process.env.BUCKET_NAME;
  const objectKey = `${notaVenta.cliente.rfc}/${notaVenta.folio}.pdf`;

  const head = await s3.send(new HeadObjectCommand({
    Bucket: bucketName,
    Key: objectKey
  }));

  const vecesEnviado = head.Metadata?.["veces-enviado"]
    ? parseInt(head.Metadata["veces-enviado"]) + 1
    : 1;

  await s3.send(new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `/${bucketName}/${objectKey}`,
    Key: objectKey,
    MetadataDirective: "REPLACE",
    Metadata: {
      "hora-envio": new Date().toISOString(),
      "nota-descargada": "false",
      "veces-enviado": vecesEnviado.toString()
    },
    ContentType: "application/pdf"
  }));

  const salesNotesServer = process.env.SALESNOTESERVER || "localhost:3001";

  const downloadUrl = `http://${salesNotesServer}/sales-notes/${notaVenta.cliente.rfc}/${notaVenta.folio}`;

  const message = `
    Estimado ${notaVenta.cliente.nombreComercial},

    Se ha generado una nueva nota de venta con folio ${notaVenta.folio}.
    Puede descargarla en el siguiente enlace:

    ${downloadUrl}
  `;

  await sns.send(new PublishCommand({
    TopicArn: process.env.ARN_TOPIC,
    Subject: `Nueva Nota de Venta - Folio ${notaVenta.folio}`,
    Message: message
  }));
}

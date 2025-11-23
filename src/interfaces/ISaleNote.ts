enum TipoSociedad {
  S_EN_NC = "S_EN_NC",        // Sociedad en Nombre Colectivo
  S_EN_CS = "S_EN_CS",        // Sociedad en Comandita Simple
  S_DE_RL = "S_DE_RL",        // Sociedad de Responsabilidad Limitada
  SA = "SA",                  // Sociedad Anónima
  S_EN_C_POR_A = "S_EN_C_POR_A", // Sociedad en Comandita por Acciones
  S_COOP = "S_COOP",          // Sociedad Cooperativa
  SAS = "SAS"                 // Sociedad por Acciones Simplificada
}

enum UnidadMedia {
  H87 = "H87",
  KGM = "KGM",
  LTR = "LTR",
  MTR = "MTR",
  E48 = "E48"
}

export interface ISaleNote {
    id: string;
    folio: string;
    clienteId: string;
    domicilioId: string;
    total: number;
    cliente: {
        id: string;
        razonSocial: TipoSociedad;
        nombreComercial: string;
        rfc: string;
        correoElectronico: string;
        telefono: string;
    };
    contenidos: IContent[];
}

export interface IContent {
    id: string;
    productoId: string;
    notaVentaId: string;
    cantidad: number;
    precioUnitario: number;
    importe: number;
    producto: {
        id: string;
        nombre: string;
        unidadMedida: UnidadMedia;
        precioBase: number;
    };
}
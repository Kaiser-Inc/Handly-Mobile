export enum ReportReason {
  InnapropiateContent = 'INNAPROPIATE_CONTENT',
  Fraud = 'FRAUD',
  Harassment = 'HARASSMENT',
  Spam = 'SPAM',
  Other = 'OTHER',
}

export const reasonTranslations: { [key in ReportReason]: string } = {
  [ReportReason.InnapropiateContent]: 'Conteúdo Impróprio',
  [ReportReason.Fraud]: 'Fraude',
  [ReportReason.Harassment]: 'Assédio',
  [ReportReason.Spam]: 'Spam',
  [ReportReason.Other]: 'Outro',
}

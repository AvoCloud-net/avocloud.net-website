/* ----------------------------------------------------------------------------
   Company facts — the one place the legal identity of avocloud.net is written
   down. The imprint, the schema.org graph and the footer all read from here, so
   a change of address or the arrival of a company register number is one edit.

   Optional fields are rendered only when they are filled. An empty string means
   "does not apply / not yet entered" and leaves the line out of the imprint
   instead of printing a blank label. Fill them from the trade licence and the
   registration documents, do not guess: an imprint with a wrong number is worse
   than one without.
   -------------------------------------------------------------------------- */

/* STATUS: the company is not founded yet, so only the owner's personal data is
   filled in. Once it is registered, fill `legalName`, `legalForm` and the
   register lines: the imprint then switches from a personal to a company
   imprint on its own. */
export const company = {
  /** Trading name as used on the site. */
  brand: 'Avocloud.net',
  /** Legal name incl. Rechtsformzusatz (§ 14 UGB), e.g. "Fabian Murauer e.U.".
      Falls back to the owner's name while empty. */
  legalName: '',
  /** e.g. "Einzelunternehmen" or "Gesellschaft mit beschränkter Haftung". */
  legalForm: '',
  owner: 'Fabian Murauer',
  street: 'Rablstraße 23a, 4.4',
  postalCode: '4600',
  city: 'Wels',
  country: 'Österreich',
  countryCode: 'AT',
  email: 'fabian.murauer@avocloud.net',
  supportEmail: 'support@avocloud.net',
  founded: 2024,

  /** Line of business as registered, e.g. "Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik". */
  businessPurpose: '',
  /** Umsatzsteuer-Identifikationsnummer, e.g. "ATU12345678". */
  uid: '',
  /** Firmenbuchnummer, e.g. "FN 123456 a". Only if entered in the Firmenbuch. */
  firmenbuchNr: '',
  /** e.g. "Landesgericht Wels". */
  firmenbuchGericht: '',
  /** Gewerbebehörde, e.g. "Magistrat der Stadt Wels". */
  gewerbebehoerde: '',
  /** Mitglied der Wirtschaftskammer … (leave empty if not applicable). */
  kammer: '',
};

export const legalName = company.legalName || company.owner;
export const addressLine = `${company.street}, ${company.postalCode} ${company.city}, ${company.country}`;

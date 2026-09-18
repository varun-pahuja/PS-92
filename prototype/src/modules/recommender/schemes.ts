/**
 * NSFDC (National Scheduled Castes Finance & Development Corporation) scheme
 * definitions. Figures are taken verbatim from the official NSFDC scheme page
 * (https://nsfdc.nic.in/scheme) and eligibility page
 * (https://nsfdc.nic.in/eligibility-requirements), captured 2026-09-18.
 *
 * NOTE ON STRUCTURE: NSFDC does not lend to citizens directly. It refinances
 * Channel Partners (SCAs/CAs) at a low rate (2.5%–5%), who then on-lend at the
 * "beneficiary" rate (6.5%–15%). The citizen-facing rate is `beneficiaryRate`.
 */

export type SchemeId = "MFS" | "TERM" | "AAJEEVIKA" | "UNY" | "ELS";
export type LoanPurpose = "business" | "education";
export type PartnerType = "SCA" | "PSB" | "RRB" | "NBFC-MFI" | "SFB" | "COOP";

export interface IScheme {
  id: SchemeId;
  nameEn: string;
  nameHi: string;
  shortEn: string;
  shortHi: string;
  purposes: LoanPurpose[];
  /** Unit / project cost band this scheme covers (INR). */
  minCost: number;
  maxCost: number;
  /** Hard cap on the loan NSFDC will support (INR). */
  maxLoan: number;
  /** Loan-to-cost cap (0.9 = 90%). */
  ltv: number;
  /** Interest rate charged to the beneficiary, % p.a. */
  beneficiaryRate: number;
  /** Interest rate NSFDC charges the channel partner, % p.a. */
  nsfdcRate: number;
  moratoriumMonths: number;
  maxTenureMonths: number;
  moratoriumNoteEn: string;
  moratoriumNoteHi: string;
  partnerTypes: PartnerType[];
  descriptionEn: string;
  descriptionHi: string;
}

export const INCOME_CEILING = 500_000; // ₹5.00 lakh, effective 07 Jan 2026
export const RATE_MIN = 6.5;
export const RATE_MAX = 15;

export const SCHEMES: IScheme[] = [
  {
    id: "MFS",
    nameEn: "Micro Finance Scheme (MFS)",
    nameHi: "सूक्ष्म वित्त योजना (MFS)",
    shortEn: "Micro loan for very small units",
    shortHi: "अति लघु इकाइयों हेतु सूक्ष्म ऋण",
    purposes: ["business"],
    minCost: 0,
    maxCost: 140_000,
    maxLoan: 125_000,
    ltv: 0.9,
    beneficiaryRate: 6.5,
    nsfdcRate: 2.5,
    moratoriumMonths: 3,
    maxTenureMonths: 36,
    moratoriumNoteEn: "Repaid quarterly within 3 years, including a 3-month moratorium.",
    moratoriumNoteHi: "3 माह की अधिस्थगन अवधि सहित 3 वर्ष के भीतर त्रैमासिक भुगतान।",
    partnerTypes: ["SCA", "PSB", "RRB"],
    descriptionEn:
      "For units costing up to ₹1.40 lakh. Loan up to 90% of project cost, capped at ₹1.25 lakh, at 6.5% p.a.",
    descriptionHi:
      "₹1.40 लाख तक की परियोजना लागत हेतु। परियोजना लागत का 90% तक ऋण, अधिकतम ₹1.25 लाख, 6.5% वार्षिक ब्याज पर।",
  },
  {
    id: "TERM",
    nameEn: "Term Loan Scheme",
    nameHi: "टर्म लोन योजना",
    shortEn: "Large loan for established units",
    shortHi: "स्थापित इकाइयों हेतु बड़ा ऋण",
    purposes: ["business"],
    minCost: 140_001,
    maxCost: 5_000_000,
    maxLoan: 4_500_000,
    ltv: 0.9,
    beneficiaryRate: 8,
    nsfdcRate: 4,
    moratoriumMonths: 6,
    maxTenureMonths: 84,
    moratoriumNoteEn:
      "Repaid quarterly within 7 years, including a 6-month moratorium (12 months for plantation / construction).",
    moratoriumNoteHi:
      "6 माह की अधिस्थगन अवधि (वृक्षारोपण/निर्माण हेतु 12 माह) सहित 7 वर्ष के भीतर त्रैमासिक भुगतान।",
    partnerTypes: ["SCA", "PSB", "RRB"],
    descriptionEn:
      "For units costing above ₹1.40 lakh up to ₹50 lakh. Loan up to 90% of cost, ₹1.25 lakh to ₹45 lakh, at 8% p.a.",
    descriptionHi:
      "₹1.40 लाख से अधिक, ₹50 लाख तक की परियोजना लागत हेतु। लागत का 90% तक ऋण, ₹1.25 लाख–₹45 लाख, 8% वार्षिक।",
  },
  {
    id: "AAJEEVIKA",
    nameEn: "Aajeevika Micro-Finance Yojana",
    nameHi: "आजीविका सूक्ष्म वित्त योजना",
    shortEn: "Fast micro loan via NBFC-MFIs",
    shortHi: "NBFC-MFI द्वारा त्वरित सूक्ष्म ऋण",
    purposes: ["business"],
    minCost: 0,
    maxCost: 140_000,
    maxLoan: 125_000,
    ltv: 0.9,
    beneficiaryRate: 15,
    nsfdcRate: 5,
    moratoriumMonths: 3,
    maxTenureMonths: 36,
    moratoriumNoteEn:
      "Prompt, need-based micro finance through selected NBFC-MFIs. Repaid quarterly within 3 years, including a 3-month moratorium.",
    moratoriumNoteHi:
      "चयनित NBFC-MFI के माध्यम से त्वरित सूक्ष्म वित्त। 3 माह की अधिस्थगन अवधि सहित 3 वर्ष के भीतर त्रैमासिक भुगतान।",
    partnerTypes: ["NBFC-MFI"],
    descriptionEn:
      "Micro finance for small/micro activities delivered through NBFC-MFIs for speed and last-mile reach, at 15% p.a.",
    descriptionHi:
      "गति एवं अंतिम छोर तक पहुँच हेतु NBFC-MFI के माध्यम से लघु/सूक्ष्म गतिविधियों के लिए सूक्ष्म वित्त, 15% वार्षिक।",
  },
  {
    id: "UNY",
    nameEn: "Udyam Nidhi Yojana (UNY)",
    nameHi: "उद्यम निधि योजना (UNY)",
    shortEn: "Mid-size loan via co-ops / SFBs",
    shortHi: "सहकारी संस्थाओं/SFB द्वारा मध्यम ऋण",
    purposes: ["business"],
    minCost: 0,
    maxCost: 500_000,
    maxLoan: 450_000,
    ltv: 0.9,
    beneficiaryRate: 13,
    nsfdcRate: 5,
    moratoriumMonths: 3,
    maxTenureMonths: 60,
    moratoriumNoteEn:
      "Repaid in quarterly or half-yearly instalments within 5 years, including a 3-month moratorium.",
    moratoriumNoteHi:
      "3 माह की अधिस्थगन अवधि सहित 5 वर्ष के भीतर त्रैमासिक या अर्धवार्षिक भुगतान।",
    partnerTypes: ["COOP", "SFB"],
    descriptionEn:
      "For units costing up to ₹5 lakh, routed via Co-operative Societies/Banks and Small Finance Banks. 13% (co-op) or 15% (SFB).",
    descriptionHi:
      "₹5 लाख तक की इकाइयों हेतु, सहकारी संस्थाओं/बैंकों तथा स्मॉल फाइनेंस बैंकों के माध्यम से। 13% (सहकारी) या 15% (SFB)।",
  },
  {
    id: "ELS",
    nameEn: "Educational Loan Scheme (ELS)",
    nameHi: "शैक्षिक ऋण योजना (ELS)",
    shortEn: "Professional / technical education loan",
    shortHi: "व्यावसायिक / तकनीकी शिक्षा ऋण",
    purposes: ["education"],
    minCost: 0,
    maxCost: 4_000_000,
    maxLoan: 4_000_000,
    ltv: 0.9,
    beneficiaryRate: 6.5,
    nsfdcRate: 2.5,
    moratoriumMonths: 12,
    maxTenureMonths: 144,
    moratoriumNoteEn:
      "Moratorium is course period + 1 year where repayment has not started (up to 6 months where loan is disbursed and repayment started). Repayment up to 12 years.",
    moratoriumNoteHi:
      "जहाँ भुगतान प्रारंभ नहीं हुआ वहाँ अधिस्थगन अवधि पाठ्यक्रम अवधि + 1 वर्ष (भुगतान प्रारंभ होने पर 6 माह तक)। पुनर्भुगतान 12 वर्ष तक।",
    partnerTypes: ["SCA", "PSB", "RRB"],
    descriptionEn:
      "For regular full-time recognised professional/technical courses in India or abroad. Up to ₹40 lakh or 90% of course fee (whichever is less), at 6.5% p.a.",
    descriptionHi:
      "भारत या विदेश में नियमित पूर्णकालिक मान्यता प्राप्त व्यावसायिक/तकनीकी पाठ्यक्रमों हेतु। ₹40 लाख या पाठ्यक्रम शुल्क का 90% (जो कम हो), 6.5% वार्षिक।",
  },
];

export const SCHEMES_BY_ID: Record<SchemeId, IScheme> = Object.fromEntries(
  SCHEMES.map((s) => [s.id, s]),
) as Record<SchemeId, IScheme>;

/** The 24 recognised course families for ELS (official NSFDC list). */
export const RECOGNISED_COURSES = [
  "Engineering (Diploma/B.Tech/BE/M.Tech/ME)",
  "Architecture (B.Arch/M.Arch)",
  "Medical (MBBS/MD/MS)",
  "Biotechnology / Microbiology / Clinical Technology",
  "Pharmacy (B.Pharma/M.Pharma)",
  "Dental (BDS/MDS)",
  "Physiotherapy (B.Sc/M.Sc)",
  "Pathology (B.Sc/M.Sc)",
  "Nursing (B.Sc/M.Sc)",
  "Information Technology (BCA/MCA)",
  "Management (BBA/MBA)",
  "Hotel Management & Catering Technology",
  "Law (LLB/LLM)",
  "Education (CT/NTT/B.Ed/M.Ed)",
  "Physical Education (C.PEd/B.PEd/M.PEd)",
  "Journalism & Mass Communication",
  "Geriatric Care",
  "Midwifery",
  "Laboratory Technician",
  "Chartered Accountancy (CA)",
  "Cost Accountancy (ICWA)",
  "Company Secretaryship (CS)",
  "Actuarial Sciences",
  "AMIE / Institute of Electronics & Telecommunication",
] as const;

export const INDIAN_STATES = [
  { code: "AP", nameEn: "Andhra Pradesh", nameHi: "आंध्र प्रदेश" },
  { code: "AS", nameEn: "Assam", nameHi: "असम" },
  { code: "BR", nameEn: "Bihar", nameHi: "बिहार" },
  { code: "CG", nameEn: "Chhattisgarh", nameHi: "छत्तीसगढ़" },
  { code: "DL", nameEn: "Delhi", nameHi: "दिल्ली" },
  { code: "GJ", nameEn: "Gujarat", nameHi: "गुजरात" },
  { code: "HR", nameEn: "Haryana", nameHi: "हरियाणा" },
  { code: "HP", nameEn: "Himachal Pradesh", nameHi: "हिमाचल प्रदेश" },
  { code: "JH", nameEn: "Jharkhand", nameHi: "झारखंड" },
  { code: "KA", nameEn: "Karnataka", nameHi: "कर्नाटक" },
  { code: "KL", nameEn: "Kerala", nameHi: "केरल" },
  { code: "MP", nameEn: "Madhya Pradesh", nameHi: "मध्य प्रदेश" },
  { code: "MH", nameEn: "Maharashtra", nameHi: "महाराष्ट्र" },
  { code: "OD", nameEn: "Odisha", nameHi: "ओडिशा" },
  { code: "PB", nameEn: "Punjab", nameHi: "पंजाब" },
  { code: "RJ", nameEn: "Rajasthan", nameHi: "राजस्थान" },
  { code: "TN", nameEn: "Tamil Nadu", nameHi: "तमिलनाडु" },
  { code: "TS", nameEn: "Telangana", nameHi: "तेलंगाना" },
  { code: "UP", nameEn: "Uttar Pradesh", nameHi: "उत्तर प्रदेश" },
  { code: "UK", nameEn: "Uttarakhand", nameHi: "उत्तराखंड" },
  { code: "WB", nameEn: "West Bengal", nameHi: "पश्चिम बंगाल" },
] as const;

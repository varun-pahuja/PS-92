/**
 * Channel-partner dataset.
 *
 * Partner NAMES, TYPES and cities are REAL — taken from the eight official
 * NSFDC channel-partner lists (https://nsfdc.nic.in/our-channel-partners).
 * Branch counts, coordinates (city centroids), and the fund-health / NPA /
 * overdue fields are [MOCK] illustrative values, because NSFDC does not
 * publish per-partner fund-utilisation or NPA data. All of it is clearly
 * labelled "illustrative" in the UI.
 */

import type { PartnerType } from "../recommender/schemes";
import type { SchemeId } from "../recommender/schemes";

export type NpaBand = "Low" | "Medium" | "High";

export interface IPartner {
  id: string;
  name: string;
  type: PartnerType;
  city: string;
  stateCode: string;
  lat: number;
  lng: number;
  /** Scheme categories this partner is authorised to route (illustrative mapping). */
  schemes: SchemeId[];
  /** [MOCK] 0–100 fund-utilisation health. Lower = stressed. */
  fundHealth: number;
  /** [MOCK] synthetic NPA band. */
  npaBand: NpaBand;
  /** [MOCK] synthetic overdue percentage. */
  overduePct: number;
  /** [MOCK] district branch count. */
  branches: number;
}

type Row = [
  string,
  string,
  PartnerType,
  string,
  string,
  number,
  number,
  SchemeId[],
  number,
  NpaBand,
  number,
  number,
];

const ROWS: Row[] = [
  // ---- State Channelising Agencies (SCAs) ----
  ["UPSCFDC", "UP Scheduled Castes Finance & Dev. Corpn. Ltd.", "SCA", "Lucknow", "UP", 26.8467, 80.9462, ["MFS", "TERM", "UNY", "ELS"], 82, "Low", 1.8, 74],
  ["UPSCFDC-GZB", "UPSCFDC — Ghaziabad Divisional Office", "SCA", "Ghaziabad", "UP", 28.6692, 77.4538, ["MFS", "TERM"], 61, "Medium", 4.6, 12],
  ["MPSCFDC", "MP State Cooperative SC Finance & Dev. Corpn.", "SCA", "Bhopal", "MP", 23.2599, 77.4126, ["MFS", "TERM", "UNY", "ELS"], 74, "Low", 2.4, 51],
  ["BSSCCDC", "Bihar State SCs Co-operative Dev. Corpn. Ltd.", "SCA", "Patna", "BR", 25.5941, 85.1376, ["MFS", "TERM", "UNY", "ELS"], 58, "Medium", 5.9, 38],
  ["DBRADC", "Dr B. R. Ambedkar Development Corpn. Ltd.", "SCA", "Bengaluru", "KA", 12.9716, 77.5946, ["MFS", "TERM", "UNY", "ELS"], 88, "Low", 1.2, 46],
  ["MPBCDC", "Mahatma Phule BCs Development Corpn. Ltd.", "SCA", "Mumbai", "MH", 19.076, 72.8777, ["MFS", "TERM", "UNY", "ELS"], 79, "Low", 2.1, 62],
  ["SLASDC", "Sahityaratna Lokshahir Annabhau Sathe Dev. Corpn.", "SCA", "Mumbai", "MH", 19.076, 72.8777, ["MFS", "TERM", "UNY", "ELS"], 67, "Medium", 3.7, 55],
  ["RSCDC", "Rajasthan SCs & STs Fin. & Dev. Co-op Corpn. Ltd.", "SCA", "Jaipur", "RJ", 26.9124, 75.7873, ["MFS", "TERM", "UNY", "ELS"], 71, "Low", 2.9, 41],
  ["TAHDCO", "Tamil Nadu Adi Dravidar Housing & Dev. Corpn.", "SCA", "Chennai", "TN", 13.0827, 80.2707, ["MFS", "TERM", "UNY", "ELS"], 84, "Low", 1.6, 44],
  ["APSCCFC", "Andhra Pradesh SCs Cooperative Finance Corpn. Ltd.", "SCA", "Vijayawada", "AP", 16.5062, 80.648, ["MFS", "TERM", "UNY", "ELS"], 63, "Medium", 4.2, 33],
  ["GSCDC", "Gujarat SCs Development Corpn.", "SCA", "Gandhinagar", "GJ", 23.2156, 72.6369, ["MFS", "TERM", "UNY", "ELS"], 76, "Low", 2.6, 36],
  ["WBSCSTOBCDFC", "West Bengal SCs, STs & OBC Dev. & Fin. Corpn.", "SCA", "Kolkata", "WB", 22.5726, 88.3639, ["MFS", "TERM", "UNY", "ELS"], 49, "High", 8.4, 47],
  ["DSFDC", "Delhi SC/ST/OBC/Minorities & Handicapped Fin. & Dev. Corpn.", "SCA", "Delhi", "DL", 28.7041, 77.1025, ["MFS", "TERM", "UNY", "ELS"], 80, "Low", 1.9, 18],
  ["KSDC", "Kerala State Development Corpn. for SCs & STs Ltd.", "SCA", "Thrissur", "KL", 10.5276, 76.2144, ["MFS", "TERM", "UNY", "ELS"], 73, "Low", 2.7, 28],
  ["PSCLDFC", "Punjab Scheduled Castes Land Dev. & Finance Corpn.", "SCA", "Chandigarh", "PB", 30.7333, 76.7794, ["MFS", "TERM", "UNY", "ELS"], 66, "Medium", 3.5, 22],
  ["HSCDC", "Haryana SCs Finance & Development Corpn. Ltd.", "SCA", "Chandigarh", "HR", 30.7333, 76.7794, ["MFS", "TERM", "UNY", "ELS"], 69, "Medium", 3.1, 20],
  ["ASCDC", "Assam State Development Corpn. for SCs Ltd.", "SCA", "Guwahati", "AS", 26.1445, 91.7362, ["MFS", "TERM", "UNY", "ELS"], 52, "High", 7.2, 26],
  ["JSCDC", "Jharkhand State Scheduled Castes Coop. Dev. Corpn.", "SCA", "Ranchi", "JH", 23.3441, 85.3096, ["MFS", "TERM", "UNY", "ELS"], 57, "Medium", 5.3, 24],
  ["CGSCFDC", "Chhattisgarh State Antavasayee Sahkari Fin. & Dev. Corpn.", "SCA", "Raipur", "CG", 21.2514, 81.6296, ["MFS", "TERM", "UNY", "ELS"], 64, "Medium", 4.4, 27],
  ["OSFDC", "Odisha SCs & STs Dev. Finance Co-op Corpn. Ltd.", "SCA", "Bhubaneswar", "OD", 20.2961, 85.8245, ["MFS", "TERM", "UNY", "ELS"], 61, "Medium", 4.8, 30],
  ["UBVEVN", "Uttarakhand Bahu-udeshiya Vitta Evam Vikas Nigam", "SCA", "Dehradun", "UK", 30.3165, 78.0322, ["MFS", "TERM", "UNY", "ELS"], 48, "High", 9.1, 13],
  ["TSCDC", "Tripura Scheduled Castes Co-op Dev. Corpn. Ltd.", "SCA", "Agartala", "TR", 23.8315, 91.2868, ["MFS", "TERM", "UNY", "ELS"], 55, "Medium", 6.0, 11],
  ["JKSCSTBCDC", "J&K SCs, STs & OBCs Development Corpn. Ltd.", "SCA", "Jammu", "JK", 32.7266, 74.857, ["MFS", "TERM", "UNY", "ELS"], 45, "High", 9.8, 14],

  // ---- [MOCK] synthetic district branches, added near stressed HQs so that
  //      health-aware rerouting has a nearby healthy alternative to offer.
  ["WBSCSTOBCDFC-HWH", "WBSCSTOBCDFC — Howrah District Office", "SCA", "Howrah", "WB", 22.5958, 88.2636, ["MFS", "TERM", "UNY"], 74, "Low", 2.3, 9],
  ["ASCDC-KAM", "ASCDC — Kamrup Metro District Office", "SCA", "Guwahati", "AS", 26.155, 91.75, ["MFS", "TERM", "UNY"], 71, "Low", 2.6, 7],
  ["UBVEVN-HRW", "UBVEVN — Haridwar District Office", "SCA", "Haridwar", "UK", 29.9457, 78.1642, ["MFS", "TERM"], 66, "Medium", 3.4, 6],
  ["JKSCST-SXR", "JKSCSTBCDC — Srinagar District Office", "SCA", "Srinagar", "JK", 34.0837, 74.7973, ["MFS", "TERM"], 63, "Medium", 4.0, 8],
  ["JSCDC-DHN", "JSCDC — Dhanbad District Office", "SCA", "Dhanbad", "JH", 23.7957, 86.4304, ["MFS", "TERM"], 60, "Medium", 4.9, 7],

  // ---- Public Sector Banks (PSBs) ----
  ["IOB", "Indian Overseas Bank (Priority Sector)", "PSB", "Chennai", "TN", 13.0827, 80.2707, ["MFS", "TERM", "ELS"], 90, "Low", 0.9, 3200],
  ["BOB", "Bank of Baroda", "PSB", "Vadodara", "GJ", 22.3072, 73.1812, ["MFS", "TERM", "ELS"], 91, "Low", 0.8, 8200],
  ["CANARA", "Canara Bank", "PSB", "Bengaluru", "KA", 12.9716, 77.5946, ["MFS", "TERM", "ELS"], 89, "Low", 1.0, 9800],
  ["PNB", "Punjab National Bank", "PSB", "Delhi", "DL", 28.6139, 77.209, ["MFS", "TERM", "ELS"], 86, "Low", 1.4, 10000],
  ["UNION", "Union Bank of India", "PSB", "Mumbai", "MH", 19.076, 72.8777, ["MFS", "TERM", "ELS"], 87, "Low", 1.3, 8600],
  ["INDIANB", "Indian Bank", "PSB", "Chennai", "TN", 13.0827, 80.2707, ["MFS", "TERM", "ELS"], 88, "Low", 1.1, 5700],
  ["MAHABANK", "Bank of Maharashtra", "PSB", "Pune", "MH", 18.5204, 73.8567, ["MFS", "TERM", "ELS"], 83, "Low", 1.7, 1900],
  ["CENTRALBK", "Central Bank of India", "PSB", "Mumbai", "MH", 19.076, 72.8777, ["MFS", "TERM", "ELS"], 78, "Medium", 2.2, 4500],

  // ---- Regional Rural Banks (RRBs) ----
  ["BGB", "Bihar Gramin Bank", "RRB", "Patna", "BR", 25.5941, 85.1376, ["MFS", "TERM", "ELS"], 62, "Medium", 4.5, 500],
  ["MGB", "Maharashtra Gramin Bank", "RRB", "Aurangabad", "MH", 19.8762, 75.3433, ["MFS", "TERM", "ELS"], 70, "Medium", 3.2, 420],
  ["UPGB", "Uttar Pradesh Gramin Bank", "RRB", "Lucknow", "UP", 26.8467, 80.9462, ["MFS", "TERM", "ELS"], 59, "Medium", 5.6, 650],
  ["KGB", "Karnataka Grameena Bank", "RRB", "Mysuru", "KA", 12.2958, 76.6394, ["MFS", "TERM", "ELS"], 72, "Low", 2.8, 480],
  ["TNGB", "Tamil Nadu Grama Bank", "RRB", "Salem", "TN", 11.6643, 78.146, ["MFS", "TERM", "ELS"], 68, "Medium", 3.4, 530],
  ["RGB", "Rajasthan Gramin Bank", "RRB", "Jodhpur", "RJ", 26.2389, 73.0243, ["MFS", "TERM", "ELS"], 65, "Medium", 3.9, 400],
  ["MPGB", "Madhya Pradesh Gramin Bank", "RRB", "Indore", "MP", 22.7196, 75.8577, ["MFS", "TERM", "ELS"], 67, "Medium", 3.6, 460],

  // ---- NBFC-MFIs (Aajeevika channel) ----
  ["SATIN", "Satin Creditcare Network Ltd.", "NBFC-MFI", "Gurugram", "HR", 28.4595, 77.0266, ["AAJEEVIKA"], 77, "Low", 2.3, 1100],
  ["MIDLAND", "Midland Microfin Ltd.", "NBFC-MFI", "Ludhiana", "PB", 30.901, 75.8573, ["AAJEEVIKA"], 64, "Medium", 4.1, 380],
  ["ASA", "ASA International Microfinance Ltd.", "NBFC-MFI", "Kolkata", "WB", 22.5726, 88.3639, ["AAJEEVIKA"], 56, "Medium", 5.7, 620],
  ["PAHAL", "Pahal Financial Services Pvt. Ltd.", "NBFC-MFI", "Ahmedabad", "GJ", 23.0225, 72.5714, ["AAJEEVIKA"], 69, "Medium", 3.3, 340],
  ["ANIK", "Anik Financial Services Pvt. Ltd.", "NBFC-MFI", "Latur", "MH", 18.4088, 76.5604, ["AAJEEVIKA"], 51, "High", 7.6, 150],
  ["GDF", "Grameen Development & Finance Pvt. Ltd.", "NBFC-MFI", "Kamrup", "AS", 26.1445, 91.7362, ["AAJEEVIKA"], 47, "High", 8.9, 90],
  ["VECTOR", "Vector Finance Pvt. Ltd.", "NBFC-MFI", "Bhubaneswar", "OD", 20.2961, 85.8245, ["AAJEEVIKA"], 58, "Medium", 5.2, 120],

  // ---- Small Finance Banks ----
  ["AU", "AU Small Finance Bank", "SFB", "Jaipur", "RJ", 26.9124, 75.7873, ["UNY", "MFS"], 85, "Low", 1.5, 900],
  ["UJJIVAN", "Ujjivan Small Finance Bank", "SFB", "Bengaluru", "KA", 12.9716, 77.5946, ["UNY", "MFS"], 81, "Low", 1.9, 600],

  // ---- Co-operative Banks / Societies ----
  ["SEWA", "Shri Mahila Sewa Sahakari Bank Ltd.", "COOP", "Ahmedabad", "GJ", 23.0225, 72.5714, ["UNY"], 74, "Low", 2.5, 45],
  ["STREENIDHI-TS", "Streenidhi Cooperative Society (Telangana)", "COOP", "Hyderabad", "TS", 17.385, 78.4867, ["UNY"], 66, "Medium", 3.8, 60],
  ["SIDBI", "Small Industries Development Bank of India", "PSB", "Lucknow", "UP", 26.8467, 80.9462, ["TERM"], 92, "Low", 0.7, 120],
];

export const PARTNERS: IPartner[] = ROWS.map((r) => ({
  id: r[0],
  name: r[1],
  type: r[2],
  city: r[3],
  stateCode: r[4],
  lat: r[5],
  lng: r[6],
  schemes: r[7],
  fundHealth: r[8],
  npaBand: r[9],
  overduePct: r[10],
  branches: r[11],
}));

export const PARTNER_TYPE_LABEL: Record<PartnerType, string> = {
  SCA: "State Channelising Agency",
  PSB: "Public Sector Bank",
  RRB: "Regional Rural Bank",
  "NBFC-MFI": "NBFC-Microfinance Institution",
  SFB: "Small Finance Bank",
  COOP: "Co-operative Bank / Society",
};

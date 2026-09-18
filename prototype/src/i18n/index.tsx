import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, string>;

const en: Dict = {
  "brand.name": "NSFDC Scheme Sarthi",
  "brand.tag": "Scheme matching, EMI projection & channel-partner routing",
  "header.helpline": "NSFDC Toll-Free Helpline: 1800 110 396",
  "header.lang": "भाषा / Language",
  "nav.recommender": "Find My Scheme",
  "nav.emi": "EMI Calculator",
  "nav.locator": "Partner Locator",
  "nav.track": "Track Application",
  "disclaimer.short":
    "Prototype for SIH — scheme data and partner data shown for demonstration; to be validated against live NSFDC/SCA data upon integration.",
  "hero.badge": "Ministry of Social Justice & Empowerment · NSFDC",
  "hero.title": "Find the right concessional loan — and the right office to apply at.",
  "hero.sub":
    "Answer a few questions. Get the best-fit NSFDC scheme, your EMI projection, and the nearest authorised Channel Partner with a healthy fund position.",
  "hero.cta": "Start eligibility check",
  "hero.trust1": "For Scheduled Caste applicants",
  "hero.trust2": "Family income up to ₹5 lakh",
  "hero.trust3": "Loans at 6.5%–15% p.a.",
  "hero.partnerHealth": "Partner health",

  "form.title": "Eligibility & scheme match",
  "form.subtitle": "No documents needed for this check. Nothing is stored.",
  "form.applicantType": "Applicant type",
  "form.applicant.individual": "Individual",
  "form.applicant.partnership": "Partnership firm",
  "form.applicant.cooperative": "Co-operative society",
  "form.isSC": "Applicant belongs to the Scheduled Caste community",
  "form.income": "Annual family income (₹)",
  "form.incomeHelp": "Ceiling is ₹5,00,000 per year.",
  "form.purpose": "What is the loan for?",
  "form.purpose.business": "Business / enterprise unit",
  "form.purpose.education": "Education (professional / technical course)",
  "form.activity": "Activity or course",
  "form.activityHelp.business": "e.g. tailoring unit, dairy, grocery shop",
  "form.activityHelp.education": "e.g. B.Tech, MBBS, MBA",
  "form.cost": "Estimated project / course cost (₹)",
  "form.courseRecognised": "My course is on NSFDC's recognised list",
  "form.state": "State / UT",
  "form.check": "Check eligibility",
  "form.reset": "Reset",

  "result.title": "Your recommended scheme",
  "result.primary": "Best fit",
  "result.fit": "Fit score",
  "result.loan": "Sanctionable loan",
  "result.own": "Your contribution",
  "result.why": "Why this scheme",
  "result.blockers": "Why this is not a match",
  "result.alternatives": "Other schemes considered",
  "result.noMatch": "No NSFDC scheme matched",
  "result.noMatchHelp":
    "Review the points below, then adjust your inputs. A Channel Partner can also advise you in person.",
  "result.scoreBreakdown": "How the fit score was built",
  "result.weight": "weight",
  "result.viewEmi": "Project EMI for this scheme",
  "result.findPartner": "Find authorised partner",
  "result.rate": "Interest rate",
  "result.moratorium": "Moratorium",
  "result.months": "months",
  "result.eligible": "Eligible",
  "result.ineligible": "Not eligible",
  "result.tip": "Tip: try the cost chips to see the recommendation change instantly.",

  // --- engine reasoning (bilingual) ---
  "why.purpose.business": "This scheme funds the business / enterprise use-case you selected.",
  "why.purpose.education": "This scheme funds the education use-case you selected.",
  "why.costInBand": "Your project cost of ₹{cost} falls within the scheme band ₹{min}–₹{max}.",
  "why.loanCapped":
    "Loan is capped at ₹{cap} (90% LTV / scheme ceiling), so your own contribution rises to ₹{own}.",
  "why.rateConcessional": "Interest rate {rate}% p.a. is at the concessional end of the 6.5%–15% range.",
  "why.rateHigher": "Interest rate {rate}% p.a. is at the higher end of the 6.5%–15% range.",
  "why.moratorium": "Moratorium of {months} month(s) with repayment over {years}+ year(s).",
  "block.purpose.educationOnly": "This is an education-only scheme; your request is for a business/enterprise unit.",
  "block.purpose.businessOnly": "This scheme funds business/enterprise units; your request is for education.",
  "block.costAboveMax": "Project cost exceeds the maximum ₹{max} for this scheme.",
  "block.costBelowMin": "Project cost is below the minimum ₹{min} for this scheme.",
  "block.courseNotRecognised": "The course is not on NSFDC's list of recognised professional/technical courses.",
  "block.notSC": "NSFDC schemes are only for applicants belonging to the Scheduled Caste community.",
  "block.incomeCeiling": "Annual family income exceeds the ₹5.00 lakh ceiling (entered: ₹{income}).",
  "block.costInvalid": "Estimated project / course cost must be greater than zero.",
  "score.costFit": "Project-cost fit",
  "score.rateFit": "Interest-rate fit",
  "score.moratoriumFit": "Moratorium benefit",
  "score.purposeFit": "Purpose match",

  // --- partner routing reasoning (bilingual) ---
  "partner.distance": "{km} km from your location",
  "partner.healthHealthy": "Healthy fund utilisation ({health}/100) — low disbursement risk",
  "partner.healthModerate": "Moderate fund health ({health}/100) — verify current fund position",
  "partner.healthStressed": "Stressed fund position ({health}/100) — expect delays",
  "partner.authorised": "Authorised for {scheme}",
  "partner.overdue": "Overdue book {pct}% — flagged",
  "partner.naiveNearest": "{km} km (naive nearest match)",

  "emi.title": "EMI & repayment projection",
  "emi.subtitle":
    "Real reducing-balance amortisation. Choose a scheme to prefill its rate, tenure and moratorium.",
  "emi.scheme": "Scheme",
  "emi.principal": "Loan amount (₹)",
  "emi.rate": "Interest rate (% p.a.)",
  "emi.tenure": "Total tenure (months)",
  "emi.moratorium": "Moratorium (months)",
  "emi.mode": "During moratorium",
  "emi.mode.interestOnly": "Interest-only (pay simple interest)",
  "emi.mode.deferred": "Fully deferred (interest capitalised)",
  "emi.emiLabel": "Monthly EMI after moratorium",
  "emi.moratoriumPayment": "Monthly payment during moratorium",
  "emi.totalInterest": "Total interest payable",
  "emi.totalPayable": "Total amount payable",
  "emi.effectivePrincipal": "Principal after moratorium",
  "emi.schedule": "Year-wise repayment schedule",
  "emi.year": "Year",
  "emi.principalPaid": "Principal paid",
  "emi.interestPaid": "Interest paid",
  "emi.totalPaid": "Total paid",
  "emi.closing": "Balance",
  "emi.chart": "Principal vs interest, year by year",

  "loc.title": "Channel Partner locator & router",
  "loc.subtitle":
    "Partners are ranked by proximity, scheme authorisation AND fund health — so stressed, high-NPA partners are avoided before you travel.",
  "loc.useMyLocation": "Use my location",
  "loc.state": "State / UT",
  "loc.scheme": "Scheme to route",
  "loc.minHealth": "Minimum fund-health score",
  "loc.excludeHighNpa": "Exclude High-NPA partners",
  "loc.results": "Ranked partners",
  "loc.distance": "Distance",
  "loc.routeScore": "Route score",
  "loc.health": "Fund health",
  "loc.npa": "NPA band",
  "loc.branches": "Branches",
  "loc.overdue": "Overdue",
  "loc.nearest": "Nearest partner (naive)",
  "loc.recommended": "Recommended (health-aware)",
  "loc.beforeAfter": "Before vs after routing",
  "loc.mapHint": "Tap a marker to see partner details.",
  "loc.noResults": "No partner matched these filters. Try widening the health filter.",
  "loc.selectPoint": "Tap anywhere on the map to set your location.",
  "loc.geoUnavailable": "Geolocation not available — pick your state instead.",
  "loc.geoUsing": "Using your device location.",
  "loc.geoDenied": "Location permission denied — pick your state instead.",

  "track.title": "Track your application",
  "track.subtitle": "Enter the Application ID issued by PM-SURAJ to see live status.",
  "track.appId": "Application ID",
  "track.appIdLabel": "Application ID",
  "track.check": "Check status",
  "track.demo": "Try a demo ID: NSFDC-2026-004821",
  "track.demoSummary": "Sharma Tailoring Unit · Micro Finance Scheme (MFS) · ₹90,000",
  "track.routed":
    "Routed to: {partner} (fund health {health}/100). Live integration will surface the actual partner and disbursement ledger from PM-SURAJ / NSFDC.",
  "track.step1": "Application submitted",
  "track.step2": "SCA eligibility & income verification",
  "track.step3": "Sanction by Channel Partner",
  "track.step4": "NSFDC refinance released",
  "track.step5": "Loan disbursed to beneficiary",
  "track.done": "Completed",
  "track.current": "In progress",
  "track.pending": "Pending",
  "track.notFound": "No application found for this ID. This is a prototype — try the demo ID.",

  "footer.owned": "Prototype content for demonstration. Scheme data © NSFDC (public).",
  "footer.helpline": "Helpline 1800 110 396",
  "footer.portal": "Apply on PM-SURAJ portal",
  "common.of": "of",
};

const hi: Dict = {
  "brand.name": "एनएसएफडीसी योजना सारथी",
  "brand.tag": "योजना मिलान, EMI अनुमान एवं चैनल पार्टनर रूटिंग",
  "header.helpline": "एनएसएफडीसी टोल-फ्री हेल्पलाइन: 1800 110 396",
  "header.lang": "भाषा / Language",
  "nav.recommender": "मेरी योजना खोजें",
  "nav.emi": "ईएमआई कैलकुलेटर",
  "nav.locator": "पार्टनर लोकेटर",
  "nav.track": "आवेदन ट्रैक करें",
  "disclaimer.short":
    "एसआईएच के लिए प्रोटोटाइप — योजना एवं पार्टनर डेटा केवल प्रदर्शन हेतु; एकीकरण पर वास्तविक एनएसएफडीसी/एससीए डेटा से सत्यापित किया जाएगा।",
  "hero.badge": "सामाजिक न्याय एवं अधिकारिता मंत्रालय · एनएसएफडीसी",
  "hero.title": "सही रियायती ऋण चुनें — और आवेदन के लिए सही कार्यालय पाएं।",
  "hero.sub":
    "कुछ प्रश्नों के उत्तर दें। अपनी सर्वोत्तम एनएसएफडीसी योजना, ईएमआई अनुमान, तथा निकटतम अधिकृत चैनल पार्टनर (स्वस्थ निधि स्थिति सहित) प्राप्त करें।",
  "hero.cta": "पात्रता जाँच शुरू करें",
  "hero.trust1": "अनुसूचित जाति के आवेदकों हेतु",
  "hero.trust2": "पारिवारिक आय ₹5 लाख तक",
  "hero.trust3": "ऋण 6.5%–15% वार्षिक ब्याज पर",
  "hero.partnerHealth": "पार्टनर निधि स्वास्थ्य",

  "form.title": "पात्रता एवं योजना मिलान",
  "form.subtitle": "इस जाँच के लिए कोई दस्तावेज़ आवश्यक नहीं। कुछ भी संग्रहीत नहीं होता।",
  "form.applicantType": "आवेदक का प्रकार",
  "form.applicant.individual": "व्यक्तिगत",
  "form.applicant.partnership": "साझेदारी फर्म",
  "form.applicant.cooperative": "सहकारी समिति",
  "form.isSC": "आवेदक अनुसूचित जाति समुदाय से संबंधित है",
  "form.income": "वार्षिक पारिवारिक आय (₹)",
  "form.incomeHelp": "सीमा ₹5,00,000 प्रति वर्ष है।",
  "form.purpose": "ऋण किस लिए है?",
  "form.purpose.business": "व्यवसाय / उद्यम इकाई",
  "form.purpose.education": "शिक्षा (व्यावसायिक / तकनीकी पाठ्यक्रम)",
  "form.activity": "गतिविधि या पाठ्यक्रम",
  "form.activityHelp.business": "जैसे सिलाई इकाई, डेयरी, किराना दुकान",
  "form.activityHelp.education": "जैसे बी.टेक, एमबीबीएस, एमबीए",
  "form.cost": "अनुमानित परियोजना / पाठ्यक्रम लागत (₹)",
  "form.courseRecognised": "मेरा पाठ्यक्रम एनएसएफडीसी की मान्यता प्राप्त सूची में है",
  "form.state": "राज्य / केंद्र शासित प्रदेश",
  "form.check": "पात्रता जाँचें",
  "form.reset": "रीसेट",

  "result.title": "आपकी अनुशंसित योजना",
  "result.primary": "सर्वोत्तम उपयुक्त",
  "result.fit": "उपयुक्तता स्कोर",
  "result.loan": "स्वीकृत ऋण राशि",
  "result.own": "आपका योगदान",
  "result.why": "यह योजना क्यों",
  "result.blockers": "यह मेल क्यों नहीं है",
  "result.alternatives": "अन्य विचारित योजनाएँ",
  "result.noMatch": "कोई एनएसएफडीसी योजना मेल नहीं खाई",
  "result.noMatchHelp":
    "नीचे दिए बिंदुओं की समीक्षा करें, फिर इनपुट बदलें। चैनल पार्टनर व्यक्तिगत रूप से भी सलाह दे सकता है।",
  "result.scoreBreakdown": "उपयुक्तता स्कोर कैसे बना",
  "result.weight": "भार",
  "result.viewEmi": "इस योजना का ईएमआई देखें",
  "result.findPartner": "अधिकृत पार्टनर खोजें",
  "result.rate": "ब्याज दर",
  "result.moratorium": "अधिस्थगन",
  "result.months": "माह",
  "result.eligible": "पात्र",
  "result.ineligible": "अपात्र",
  "result.tip": "सुझाव: अनुशंसा तुरंत बदलते देखने हेतु लागत चिप्स आज़माएँ।",

  "why.purpose.business": "यह योजना आपकी चुनी हुई व्यवसाय / उद्यम श्रेणी को वित्त करती है।",
  "why.purpose.education": "यह योजना आपकी चुनी हुई शिक्षा श्रेणी को वित्त करती है।",
  "why.costInBand": "आपकी परियोजना लागत ₹{cost} योजना की सीमा ₹{min}–₹{max} के भीतर है।",
  "why.loanCapped":
    "ऋण ₹{cap} पर सीमित है (90% LTV / योजना सीमा), इसलिए आपका योगदान ₹{own} तक बढ़ता है।",
  "why.rateConcessional": "ब्याज दर {rate}% वार्षिक, 6.5%–15% सीमा के रियायती छोर पर है।",
  "why.rateHigher": "ब्याज दर {rate}% वार्षिक, 6.5%–15% सीमा के ऊँचे छोर पर है।",
  "why.moratorium": "{months} माह की अधिस्थगन अवधि, {years}+ वर्ष में पुनर्भुगतान।",
  "block.purpose.educationOnly": "यह केवल-शिक्षा योजना है; आपका अनुरोध व्यवसाय/उद्यम इकाई हेतु है।",
  "block.purpose.businessOnly": "यह योजना व्यवसाय/उद्यम इकाइयों को वित्त करती है; आपका अनुरोध शिक्षा हेतु है।",
  "block.costAboveMax": "परियोजना लागत इस योजना की अधिकतम ₹{max} से अधिक है।",
  "block.costBelowMin": "परियोजना लागत इस योजना की न्यूनतम ₹{min} से कम है।",
  "block.courseNotRecognised":
    "पाठ्यक्रम एनएसएफडीसी की मान्यता प्राप्त व्यावसायिक/तकनीकी पाठ्यक्रम सूची में नहीं है।",
  "block.notSC": "एनएसएफडीसी योजनाएँ केवल अनुसूचित जाति समुदाय के आवेदकों हेतु हैं।",
  "block.incomeCeiling": "वार्षिक पारिवारिक आय ₹5.00 लाख की सीमा से अधिक है (दर्ज: ₹{income})।",
  "block.costInvalid": "अनुमानित परियोजना / पाठ्यक्रम लागत शून्य से अधिक होनी चाहिए।",
  "score.costFit": "परियोजना-लागत उपयुक्तता",
  "score.rateFit": "ब्याज-दर उपयुक्तता",
  "score.moratoriumFit": "अधिस्थगन लाभ",
  "score.purposeFit": "प्रयोजन मिलान",

  "partner.distance": "आपके स्थान से {km} किमी",
  "partner.healthHealthy": "स्वस्थ निधि उपयोग ({health}/100) — कम संवितरण जोखिम",
  "partner.healthModerate": "मध्यम निधि स्वास्थ्य ({health}/100) — वर्तमान निधि स्थिति जाँचें",
  "partner.healthStressed": "दबावग्रस्त निधि स्थिति ({health}/100) — विलंब की संभावना",
  "partner.authorised": "{scheme} हेतु अधिकृत",
  "partner.overdue": "अतिदेय पुस्तक {pct}% — चिह्नित",
  "partner.naiveNearest": "{km} किमी (साधारण निकटतम मिलान)",

  "emi.title": "ईएमआई एवं पुनर्भुगतान अनुमान",
  "emi.subtitle":
    "वास्तविक घटती-शेष परिशोधन। दर, अवधि एवं अधिस्थगन भरने के लिए योजना चुनें।",
  "emi.scheme": "योजना",
  "emi.principal": "ऋण राशि (₹)",
  "emi.rate": "ब्याज दर (% वार्षिक)",
  "emi.tenure": "कुल अवधि (माह)",
  "emi.moratorium": "अधिस्थगन (माह)",
  "emi.mode": "अधिस्थगन के दौरान",
  "emi.mode.interestOnly": "केवल ब्याज (साधारण ब्याज भुगतान)",
  "emi.mode.deferred": "पूर्णतः स्थगित (ब्याज पूंजीकृत)",
  "emi.emiLabel": "अधिस्थगन के बाद मासिक ईएमआई",
  "emi.moratoriumPayment": "अधिस्थगन के दौरान मासिक भुगतान",
  "emi.totalInterest": "कुल देय ब्याज",
  "emi.totalPayable": "कुल देय राशि",
  "emi.effectivePrincipal": "अधिस्थगन के बाद मूलधन",
  "emi.schedule": "वर्ष-वार पुनर्भुगतान अनुसूची",
  "emi.year": "वर्ष",
  "emi.principalPaid": "भुगतान किया मूलधन",
  "emi.interestPaid": "भुगतान किया ब्याज",
  "emi.totalPaid": "कुल भुगतान",
  "emi.closing": "शेष",
  "emi.chart": "मूलधन बनाम ब्याज, वर्ष-वार",

  "loc.title": "चैनल पार्टनर लोकेटर एवं राउटर",
  "loc.subtitle":
    "पार्टनर निकटता, योजना अधिकृति तथा निधि-स्वास्थ्य के आधार पर क्रमबद्ध — ताकि यात्रा से पहले दबावग्रस्त, उच्च-एनपीए पार्टनर से बचा जाए।",
  "loc.useMyLocation": "मेरा स्थान उपयोग करें",
  "loc.state": "राज्य / केंद्र शासित प्रदेश",
  "loc.scheme": "रूट हेतु योजना",
  "loc.minHealth": "न्यूनतम निधि-स्वास्थ्य स्कोर",
  "loc.excludeHighNpa": "उच्च-एनपीए पार्टनर हटाएँ",
  "loc.results": "क्रमबद्ध पार्टनर",
  "loc.distance": "दूरी",
  "loc.routeScore": "रूट स्कोर",
  "loc.health": "निधि स्वास्थ्य",
  "loc.npa": "एनपीए बैंड",
  "loc.branches": "शाखाएँ",
  "loc.overdue": "अतिदेय",
  "loc.nearest": "निकटतम पार्टनर (साधारण)",
  "loc.recommended": "अनुशंसित (स्वास्थ्य-सजग)",
  "loc.beforeAfter": "रूटिंग से पहले बनाम बाद",
  "loc.mapHint": "पार्टनर विवरण हेतु मार्कर पर टैप करें।",
  "loc.noResults": "इन फ़िल्टरों से कोई पार्टनर मेल नहीं खाया। स्वास्थ्य फ़िल्टर बढ़ाएँ।",
  "loc.selectPoint": "अपना स्थान चुनने हेतु मानचित्र पर कहीं भी टैप करें।",
  "loc.geoUnavailable": "भू-स्थान सुविधा उपलब्ध नहीं — कृपया अपना राज्य चुनें।",
  "loc.geoUsing": "आपके डिवाइस का स्थान उपयोग किया जा रहा है।",
  "loc.geoDenied": "स्थान अनुमति अस्वीकृत — कृपया अपना राज्य चुनें।",

  "track.title": "अपना आवेदन ट्रैक करें",
  "track.subtitle": "लाइव स्थिति देखने हेतु PM-SURAJ द्वारा जारी आवेदन आईडी दर्ज करें।",
  "track.appId": "आवेदन आईडी",
  "track.appIdLabel": "आवेदन आईडी",
  "track.check": "स्थिति देखें",
  "track.demo": "डेमो आईडी आज़माएँ: NSFDC-2026-004821",
  "track.demoSummary": "शर्मा सिलाई इकाई · सूक्ष्म वित्त योजना (MFS) · ₹90,000",
  "track.routed":
    "रूट किया गया: {partner} (निधि स्वास्थ्य {health}/100)। लाइव एकीकरण PM-SURAJ / एनएसएफडीसी से वास्तविक पार्टनर एवं संवितरण लेजर दिखाएगा।",
  "track.step1": "आवेदन जमा किया गया",
  "track.step2": "एससीए पात्रता एवं आय सत्यापन",
  "track.step3": "चैनल पार्टनर द्वारा स्वीकृति",
  "track.step4": "एनएसएफडीसी पुनर्वित्त जारी",
  "track.step5": "लाभार्थी को ऋण संवितरित",
  "track.done": "पूर्ण",
  "track.current": "प्रगतिरत",
  "track.pending": "लंबित",
  "track.notFound": "इस आईडी हेतु कोई आवेदन नहीं मिला। यह प्रोटोटाइप है — डेमो आईडी आज़माएँ।",

  "footer.owned": "प्रदर्शन हेतु प्रोटोटाइप सामग्री। योजना डेटा © एनएसएफडीसी (सार्वजनिक)।",
  "footer.helpline": "हेल्पलाइन 1800 110 396",
  "footer.portal": "PM-SURAJ पोर्टल पर आवेदन करें",
  "common.of": "में से",
};

const DICTS: Record<Lang, Dict> = { en, hi };

export type TParams = Record<string, string | number>;

interface II18nContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a key, interpolating `{param}` placeholders. */
  t: (key: string, params?: TParams) => string;
}

const I18nContext = createContext<II18nContext | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const value = useMemo<II18nContext>(
    () => ({
      lang,
      setLang,
      t: (key: string, params?: TParams) => {
        let text = DICTS[lang][key] ?? DICTS.en[key] ?? key;
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            const rendered = typeof v === "number" ? v.toLocaleString("en-IN") : v;
            text = text.replaceAll(`{${k}}`, rendered);
          }
        }
        return text;
      },
    }),
    [lang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): II18nContext {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export const locales: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];


export type Agreement = {
    id: string;
    partner: string;
    type: string;
    status: string;
    amount: string;
    amountUSD: string;
    grantTotal: string;
    topUp: string;
    balance: string;
};

export type AgreementDetail = {
    id: string;
    partnerType: string;
    originCountry?: string;
    partnerName: string;
    partnerSubType?: string;
    status: string;
    signatureDate: string;
    startDate: string;
    endDate: string;
    agreementType: string;
    currency: string;
    exchangeRate: string;
    amount: string;
    amountUsd: string;
    purposeOfFunding: string;
    costSharing: string;
    termsAndConditions: string;
    treatmentOfInterest: string;
    treatmentOfUnspentBalance: string;
    comments?: string;
    attachments: string[];
};

export type Grant = {
    sno: number;
    agreementId: string;
    rGrantNumber: string;
    mGrantNumber: string;
    costCenter: string;
    sponsoredProgram: string;
    projectId: string;
    amount: string;
    currency: string;
    amountUSD: string;
    status: string;
    focalPoints: { name: string; email: string }[];
    comments: string;
};

export type Amendment = {
    sno: number;
    type: string;
    agreementNo: string;
    amendmentType: string;
    status: string;
    createdAt: string;
    expanded: boolean;
    oldDate?: string;
    newDate?: string;
    currentProject?: string;
    newProject?: string;
    comment?: string;
    // Add other fields as optional if needed
};

export const INITIAL_AGREEMENTS: Agreement[] = [
    {
        id: 'AT26011',
        partner: 'United Nations Development Programme',
        type: 'Cash Transfer',
        status: 'DRAFT',
        amount: '15000.00 EUR',
        amountUSD: '17480.00',
        grantTotal: '0.00',
        topUp: '0.00',
        balance: '17480.00',
    },
    {
        id: 'AT26010',
        partner: 'World Health Organization',
        type: 'Exchange of Letters',
        status: 'SUBMITTED FOR REVIEW',
        amount: '25000.00 CHF',
        amountUSD: '28750.00',
        grantTotal: '0.00',
        topUp: '0.00',
        balance: '28750.00',
    },
    {
        id: 'XX26009',
        partner: 'European Bank for Reconstruction and Development',
        type: 'Cash Transfer',
        status: 'COMPLETED',
        amount: '888.00 BYN',
        amountUSD: '312.68',
        grantTotal: '195.15',
        topUp: '0.00',
        balance: '117.53',
    },
    {
        id: 'XX26008',
        partner: 'Peacebuilding Fund Guinea',
        type: 'Exchange of Letters',
        status: 'CANCELLED',
        amount: '400.00 AOA',
        amountUSD: '0.44',
        grantTotal: '0.00',
        topUp: '0.00',
        balance: '0.44',
    },
];

export const INITIAL_AGREEMENT_DETAILS: AgreementDetail[] = [
    {
        id: 'AT26011',
        partnerType: 'UN Agency',
        originCountry: 'United States',
        partnerName: 'United Nations Development Programme',
        status: 'DRAFT',
        signatureDate: '',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        agreementType: 'Cash Transfer',
        currency: 'EUR',
        exchangeRate: '1.1653',
        amount: '15000.00',
        amountUsd: '17480.00',
        purposeOfFunding: 'General Purpose (GP)',
        costSharing: 'No',
        termsAndConditions: 'Standard UN to UN agreement terms apply.',
        treatmentOfInterest: 'Retain',
        treatmentOfUnspentBalance: 'Return to Donor',
        comments: 'Draft agreement pending review.',
        attachments: [],
    },
    {
        id: 'AT26010',
        partnerType: 'UN Agency',
        originCountry: 'Switzerland',
        partnerName: 'World Health Organization',
        status: 'SUBMITTED FOR REVIEW',
        signatureDate: '2026-01-20',
        startDate: '2026-02-01',
        endDate: '2027-01-31',
        agreementType: 'Exchange of Letters',
        currency: 'CHF',
        exchangeRate: '1.1500',
        amount: '25000.00',
        amountUsd: '28750.00',
        purposeOfFunding: 'Project specific',
        costSharing: 'Yes',
        termsAndConditions: 'Subject to WHO financial regulations.',
        treatmentOfInterest: 'Return to Donor',
        treatmentOfUnspentBalance: 'Return to Donor',
        comments: 'Submitted for internal review.',
        attachments: ['draft_agreement.pdf'],
    },
    {
        id: 'XX26009',
        partnerType: 'Member States and EU',
        originCountry: 'European Union',
        partnerName: 'European Bank for Reconstruction and Development',
        status: 'COMPLETED',
        signatureDate: '2026-01-10',
        startDate: '2026-01-15',
        endDate: '2026-12-31',
        agreementType: 'Cash Transfer',
        currency: 'BYN',
        exchangeRate: '0.3520',
        amount: '888.00',
        amountUsd: '312.68',
        purposeOfFunding: 'General Purpose (GP)',
        costSharing: 'No',
        termsAndConditions:
            'Funds shall be used in accordance with the agreed programme objectives. Reporting will be provided on a quarterly basis.',
        treatmentOfInterest: 'Retain',
        treatmentOfUnspentBalance: 'Return to Donor',
        comments: '',
        attachments: ['agreement_document.pdf'],
    },
    {
        id: 'XX26008',
        partnerType: 'Multi-Partner Trust Fund',
        originCountry: 'Global',
        partnerName: 'Peacebuilding Fund Guinea',
        status: 'CANCELLED',
        signatureDate: '2025-10-05',
        startDate: '2025-10-15',
        endDate: '2026-03-31',
        agreementType: 'Exchange of Letters',
        currency: 'AOA',
        exchangeRate: '0.0011',
        amount: '400.00',
        amountUsd: '0.44',
        purposeOfFunding: 'Project specific',
        costSharing: 'Yes',
        termsAndConditions:
            'This agreement is subject to the standard terms and conditions for exchange of letters and applicable programme guidelines.',
        treatmentOfInterest: 'Return to Donor',
        treatmentOfUnspentBalance: 'Return to Donor',
        comments: '',
        attachments: ['exchange_of_letters.pdf'],
    },
    {
        id: 'AU26007',
        partnerType: 'Private Sector',
        partnerSubType: 'Corporation',
        originCountry: 'Australia',
        partnerName: 'Australia Federal Police',
        status: 'COMPLETED',
        signatureDate: '2025-08-20',
        startDate: '2025-09-01',
        endDate: '2026-09-01',
        agreementType: 'Exchange of Letters',
        currency: 'ALL',
        exchangeRate: '0.0121',
        amount: '44243.00',
        amountUsd: '537.13',
        purposeOfFunding: 'Cost sharing',
        costSharing: 'Yes',
        termsAndConditions:
            'Contributions will be administered in line with UNODC financial rules. Any changes must be agreed in writing by both parties.',
        treatmentOfInterest: 'Retain',
        treatmentOfUnspentBalance: 'Retain',
        comments: '',
        attachments: ['agreement_signed.pdf'],
    },
];

export const INITIAL_GRANTS: Grant[] = [
    {
        sno: 1,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300000',
        mGrantNumber: 'M1-32ADK-2200001',
        costCenter: '13401',
        sponsoredProgram: 'UNODC-ADV-00001 - Public Information',
        projectId: 'AFGZ87',
        amount: '2000.00',
        currency: 'EUR',
        amountUSD: '2331.00',
        status: 'DRAFT',
        focalPoints: [{ name: 'Test Focal Point 1', email: 'test.fp1@example.com' }],
        comments: 'Draft grant pending submission.',
    },
    {
        sno: 2,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300001',
        mGrantNumber: '',
        costCenter: '13402',
        sponsoredProgram: 'UNODC-ADV-00002',
        projectId: 'AFGZ88',
        amount: '5000.00',
        currency: 'EUR',
        amountUSD: '5827.00',
        status: 'SUBMITTED FOR REVIEW',
        focalPoints: [{ name: 'Test Focal Point 2', email: 'test.fp2@example.com' }],
        comments: 'Submitted for initial review.',
    },
    {
        sno: 3,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300002',
        mGrantNumber: '',
        costCenter: '13403',
        sponsoredProgram: 'UNODC-ADV-00003',
        projectId: 'AFGZ89',
        amount: '10000.00',
        currency: 'EUR',
        amountUSD: '11654.00',
        status: 'READY FOR UMOJA APPROVAL',
        focalPoints: [{ name: 'Test Focal Point 3', email: 'test.fp3@example.com' }],
        comments: 'Ready for Umoja system approval.',
    },
    {
        sno: 4,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300003',
        mGrantNumber: '',
        costCenter: '13404',
        sponsoredProgram: 'UNODC-ADV-00004',
        projectId: 'AFGZ90',
        amount: '7500.00',
        currency: 'EUR',
        amountUSD: '8740.00',
        status: 'SENT FOR UMOJA APPROVAL',
        focalPoints: [{ name: 'Test Focal Point 4', email: 'test.fp4@example.com' }],
        comments: 'Submitted to FRMS for final approval.',
    },
    {
        sno: 5,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32FSB-000612',
        mGrantNumber: 'M1-32FSB-000411',
        costCenter: '13455',
        sponsoredProgram: 'UNODC-BRA-00001 - Brazil',
        projectId: 'GLOZ31',
        amount: '50000.00',
        currency: 'EUR',
        amountUSD: '58139.53',
        status: 'Approved',
        focalPoints: [
            { name: 'Test Focal Point 5', email: 'test.fp5@example.com' },
            { name: 'Test Focal Point 1', email: 'test.fp1@example.com' },
        ],
        comments: 'Grant operational and active.',
    },
    {
        sno: 6,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300005',
        mGrantNumber: '',
        costCenter: '13406',
        sponsoredProgram: 'UNODC-ADV-00006',
        projectId: 'AFGZ92',
        amount: '3000.00',
        currency: 'EUR',
        amountUSD: '3496.00',
        status: 'PENDING SO ACTIONS',
        focalPoints: [{ name: 'Test Focal Point 6', email: 'test.fp6@example.com' }],
        comments: 'Pending action from Certifying Officer.',
    },
    {
        sno: 7,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300006',
        mGrantNumber: '',
        costCenter: '13407',
        sponsoredProgram: 'UNODC-ADV-00007',
        projectId: 'AFGZ93',
        amount: '1200.00',
        currency: 'EUR',
        amountUSD: '1398.00',
        status: 'RETURN TO CPS',
        focalPoints: [{ name: 'Test Focal Point 7', email: 'test.fp7@example.com' }],
        comments: 'Returned to CPS for corrections.',
    },
    {
        sno: 8,
        agreementId: 'XX26009',
        rGrantNumber: 'R1-32ADK-2300007',
        mGrantNumber: '',
        costCenter: '13408',
        sponsoredProgram: 'UNODC-ADV-00008',
        projectId: 'AFGZ94',
        amount: '0.00',
        currency: 'EUR',
        amountUSD: '0.00',
        status: 'CANCELLED',
        focalPoints: [],
        comments: 'Grant cancelled.',
    },
];

export const INITIAL_AMENDMENTS: Amendment[] = [
    {
        sno: 1,
        type: 'Agreement',
        agreementNo: 'AT26011',
        amendmentType: 'No Cost Extension',
        status: 'DRAFT',
        createdAt: '2/15/26, 10:00 AM',
        expanded: false,
        oldDate: '12/31/2026',
        newDate: '06/30/2027',
    },
    {
        sno: 2,
        type: 'Grant',
        agreementNo: 'R1-32FSB-000612',
        amendmentType: 'Change Of Purpose Or Project',
        status: 'SUBMITTED FOR REVIEW',
        createdAt: '2/10/26, 09:30 AM',
        expanded: false,
        currentProject: 'GLOZ31',
        newProject: 'GLOZ32',
    },
    {
        sno: 3,
        type: 'Grant',
        agreementNo: 'R1-32FSB-003681',
        amendmentType: 'Change Of Purpose Or Project',
        status: 'SUBMITTED FOR APPROVAL',
        createdAt: '12/30/25, 3:40 PM',
        expanded: false,
        currentProject: 'AFGZ87',
        newProject: 'AFGZ88',
    },
    {
        sno: 4,
        type: 'Agreement',
        agreementNo: 'XX26009',
        amendmentType: 'No Cost Extension',
        status: 'COMPLETED',
        createdAt: '11/20/25, 11:15 AM',
        expanded: false,
        oldDate: '12/31/2025',
        newDate: '06/30/2026',
    },
    {
        sno: 5,
        type: 'Grant',
        agreementNo: 'R1-32ADK-2300007',
        amendmentType: 'Grant Re-programming',
        status: 'CANCELLED',
        createdAt: '10/05/25, 02:00 PM',
        expanded: false,
        comment: 'Amendment cancelled by user.',
    },
];

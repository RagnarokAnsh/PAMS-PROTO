import { createContext, useContext, useState, ReactNode } from 'react';
import {
    Agreement,
    AgreementDetail,
    Grant,
    Amendment,
    INITIAL_AGREEMENTS,
    INITIAL_AGREEMENT_DETAILS,
    INITIAL_GRANTS,
    INITIAL_AMENDMENTS,
} from '../data/mockData';

interface MockDataContextType {
    agreements: Agreement[];
    agreementDetails: AgreementDetail[];
    grants: Grant[];
    amendments: Amendment[];
    updateAgreementStatus: (id: string, status: string) => void;
    updateGrantStatus: (sno: number, status: string) => void;
    updateAmendmentStatus: (sno: number, status: string) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
    const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
    const [agreementDetails, setAgreementDetails] = useState<AgreementDetail[]>(
        INITIAL_AGREEMENT_DETAILS
    );
    const [grants, setGrants] = useState<Grant[]>(INITIAL_GRANTS);
    const [amendments, setAmendments] = useState<Amendment[]>(INITIAL_AMENDMENTS);

    const updateAgreementStatus = (id: string, status: string) => {
        setAgreements((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
        setAgreementDetails((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
    };

    const updateGrantStatus = (sno: number, status: string) => {
        setGrants((prev) =>
            prev.map((g) => (g.sno === sno ? { ...g, status } : g))
        );
    };

    const updateAmendmentStatus = (sno: number, status: string) => {
        setAmendments((prev) =>
            prev.map((a) => (a.sno === sno ? { ...a, status } : a))
        );
    };

    return (
        <MockDataContext.Provider
            value={{
                agreements,
                agreementDetails,
                grants,
                amendments,
                updateAgreementStatus,
                updateGrantStatus,
                updateAmendmentStatus,
            }}
        >
            {children}
        </MockDataContext.Provider>
    );
}

export function useMockData() {
    const context = useContext(MockDataContext);
    if (context === undefined) {
        throw new Error('useMockData must be used within a MockDataProvider');
    }
    return context;
}

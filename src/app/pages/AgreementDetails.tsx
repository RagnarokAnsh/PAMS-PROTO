import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Grants } from './Grants';
import { Amendments } from './Amendments';

type AgreementDetailsData = {
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { useMockData } from '../context/MockDataContext';

import { useUser } from '../context/UserContext';

/* ── tiny helpers ───────────────────────────────────────────── */

function FieldRow({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <dt className="text-xs text-gray-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-900">{value || '—'}</dd>
    </div>
  );
}

/* ── tabs constant ──────────────────────────────────────────── */
const TABS = [
  { key: 'agreement', label: 'Agreement', icon: '📄' },
  { key: 'grants', label: 'Grants', icon: '💰' },
  { key: 'amendments', label: 'Amendments', icon: '📝' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function AgreementDetails() {
  const { agreementId } = useParams<{ agreementId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('agreement');
  const { userRole } = useUser();
  const { agreementDetails, updateAgreementStatus } = useMockData();
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: string;
    newStatus: string;
  }>({ open: false, action: '', newStatus: '' });

  const agreement = agreementDetails.find((a) => a.id === agreementId);

  // Status badge color logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED FOR REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActionClick = (action: string, newStatus: string) => {
    setActionDialog({ open: true, action, newStatus });
  };

  const confirmAction = () => {
    if (agreementId && actionDialog.newStatus) {
      updateAgreementStatus(agreementId, actionDialog.newStatus);
      toast.success(`Agreement ${actionDialog.action} successfully`);
      setActionDialog({ open: false, action: '', newStatus: '' });
    }
  };

  const getActionButtons = (status?: string) => {
    const backButton = (
      <Link to="/dashboard/agreements">
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to agreements list
        </Button>
      </Link>
    );

    if (userRole === 'FRMS') {
      switch (status) {
        case 'SUBMITTED FOR REVIEW':
          return (
            <>
              {backButton}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleActionClick('Rejected', 'DRAFT')}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                onClick={() => handleActionClick('Approved', 'COMPLETED')}
              >
                Approve
              </Button>
            </>
          );
        default:
          return backButton;
      }
    }

    // Default CPS Actions
    switch (status) {
      case 'DRAFT':
        return (
          <>
            {backButton}
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/5"
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                handleActionClick('Submitted', 'SUBMITTED FOR REVIEW')
              }
            >
              Submit For Review
            </Button>
          </>
        );
      case 'SUBMITTED FOR REVIEW':
        return (
          <>
            {backButton}
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/5"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleActionClick('Cancelled', 'CANCELLED')}
            >
              Cancel
            </Button>
            {/* Added for testing convenience if needed, otherwise rely on FRMS */}
          </>
        );

      case 'COMPLETED':
      case 'CANCELLED':
      default:
        return backButton;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Sub-header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Balance</span>
            <div className="text-lg font-semibold text-gray-900">
              ${(Number(agreement?.amountUsd || 0) - Number('0')).toFixed(2)}
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(agreement?.status || '')}`}>
                {agreement?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-gray-200"></div>
          <Link to="/dashboard/agreements">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
        {/* ── Tabs header ───────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-2 border-b border-gray-200">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  pb-3 pt-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                  ${activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {/* <span>{tab.icon}</span> */}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Agreement tab ─────────────────────────────────── */}
        {activeTab === 'agreement' && (
          <div className="p-8 max-w-5xl mx-auto">
            {!agreement ? (
              <div className="text-center py-12 text-gray-500">
                Agreement not found for ID: {agreementId}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Partner Details Section */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Partner Details
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <FieldRow
                      label="Partner Type"
                      value={agreement.partnerType}
                    />
                    <FieldRow
                      label="Origin Country"
                      value={agreement.originCountry}
                    />
                    <FieldRow
                      label="Partner Name"
                      value={agreement.partnerName}
                      fullWidth
                    />
                    {agreement.partnerSubType && (
                      <FieldRow
                        label="Partner Sub Type"
                        value={agreement.partnerSubType}
                      />
                    )}
                  </dl>
                </section>

                {/* Agreement Details Section */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Agreement Details
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <FieldRow label="Agreement ID" value={agreement.id} />
                    <FieldRow label="Status" value={agreement.status} />
                    <FieldRow
                      label="Signature Date"
                      value={agreement.signatureDate}
                    />
                    <FieldRow
                      label="Start Date"
                      value={agreement.startDate}
                    />
                    <FieldRow label="End Date" value={agreement.endDate} />
                    <FieldRow
                      label="Agreement Type"
                      value={agreement.agreementType}
                    />
                    <FieldRow
                      label="Currency"
                      value={agreement.currency}
                    />
                    <FieldRow
                      label="Exchange Rate"
                      value={agreement.exchangeRate}
                    />
                    <FieldRow
                      label="Amount"
                      value={
                        agreement
                          ? `${agreement.amount} ${agreement.currency}`
                          : '—'
                      }
                    />
                    <FieldRow
                      label="Amount in USD"
                      value={agreement?.amountUsd}
                    />
                    <FieldRow
                      label="Purpose of Funding"
                      value={agreement?.purposeOfFunding}
                    />
                    <FieldRow
                      label="Cost Sharing"
                      value={agreement?.costSharing}
                    />
                    <FieldRow
                      label="Treatment of Interest"
                      value={agreement?.treatmentOfInterest}
                    />
                    <FieldRow
                      label="Treatment of Unspent Balance"
                      value={agreement?.treatmentOfUnspentBalance}
                    />
                    <FieldRow
                      label="Terms and Conditions"
                      value={agreement?.termsAndConditions}
                      fullWidth
                    />
                    <FieldRow
                      label="Comments"
                      value={agreement?.comments}
                      fullWidth
                    />
                    <FieldRow
                      label="Attachments"
                      value={
                        agreement?.attachments?.length ? (
                          <div className="space-y-1">
                            {agreement.attachments.map((name) => (
                              <span
                                key={name}
                                className="text-sm text-primary underline cursor-pointer"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          '—'
                        )
                      }
                      fullWidth
                    />
                  </dl>
                </section>

                {/* Bottom action buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-8">
                  {getActionButtons(agreement.status)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Grants tab ────────────────────────────────────── */}
        {activeTab === 'grants' && (
          <div className="p-6">
            <Grants embedded agreementId={agreementId ?? ''} />
          </div>
        )}

        {/* ── Amendments tab ────────────────────────────────── */}
        {activeTab === 'amendments' && (
          <div className="p-6">
            <Amendments embedded agreementId={agreementId ?? ''} />
          </div>
        )}
      </div>

      <AlertDialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will change the status of the agreement to <strong>{actionDialog.newStatus}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setActionDialog({ open: false, action: '', newStatus: '' })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Search, ChevronDown, ChevronRight, RotateCcw, RefreshCw, Plus, X } from 'lucide-react';
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

type AmendmentType =
  | 'agreement-no-cost-extension'
  | 'agreement-amend-contribution-amount'
  | 'agreement-termination';

type AmendmentFormValues = {
  amendmentType: AmendmentType | '';

  currentEndDate?: string;
  newEndDate?: string;

  totalContributionAmount?: string;
  availableContributionAmount?: string;
  contributionAdjustmentType?: 'top-up' | 'reduction';
  adjustmentAmount?: string;
  amountUsd?: string;

  // Termination
  terminationDate?: string;
  terminationReason?: string;

  attachments?: FileList;
  comments?: string;
};

type AmendmentsProps = {
  embedded?: boolean;
  agreementId?: string;
};

export function Amendments({ embedded = false, agreementId }: AmendmentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const { userRole } = useUser();
  const { amendments, updateAmendmentStatus } = useMockData();

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: string;
    newStatus: string;
    amendmentSno?: number;
  }>({ open: false, action: '', newStatus: '' });

  const scopedAmendments = useMemo(() => {
    if (!agreementId) return amendments;
    return amendments.filter((a) => a.agreementNo === agreementId);
  }, [agreementId, amendments]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AmendmentFormValues>({
    defaultValues: {
      amendmentType: '',
      currentEndDate: '',
      newEndDate: '',
      totalContributionAmount: '',
      availableContributionAmount: '',
      contributionAdjustmentType: '',
      adjustmentAmount: '',
      amountUsd: '',
      terminationDate: '',
      terminationReason: '',
      comments: '',
    },
  });

  const amendmentType = watch('amendmentType');

  const onOpenNewModal = () => {
    reset();
    setShowNewModal(true);
  };

  const onSubmit = (data: AmendmentFormValues) => {
    console.log('New Amendment:', data);
    setShowNewModal(false);
  };

  const toggleRow = (sno: number) => {
    setExpandedRow(expandedRow === sno ? null : sno);
  };

  const statusColors = {
    DRAFT: 'bg-yellow-100 text-yellow-800',
    'SUBMITTED FOR REVIEW': 'bg-blue-100 text-blue-800',
    'SUBMITTED FOR APPROVAL': 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-700',
  } as const;

  const handleActionClick = (
    sno: number,
    action: string,
    newStatus: string
  ) => {
    setActionDialog({ open: true, action, newStatus, amendmentSno: sno });
  };

  const confirmAction = () => {
    if (actionDialog.amendmentSno && actionDialog.newStatus) {
      updateAmendmentStatus(actionDialog.amendmentSno, actionDialog.newStatus);
      toast.success(`Amendment ${actionDialog.action} successfully`);
      setActionDialog({ open: false, action: '', newStatus: '' });
    }
  };

  const getAmendmentActions = (sno: number, status: string) => {
    if (userRole === 'FRMS') {
      switch (status) {
        case 'SUBMITTED FOR APPROVAL':
          return (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleActionClick(sno, 'Rejected', 'DRAFT')}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                onClick={() => handleActionClick(sno, 'Approved', 'COMPLETED')}
              >
                Approve
              </Button>
            </>
          );
        default:
          return null;
      }
    }

    switch (status) {
      case 'DRAFT':
        return (
          <>
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
                handleActionClick(sno, 'Submitted', 'SUBMITTED FOR REVIEW')
              }
            >
              Submit For Review
            </Button>
          </>
        );
      case 'SUBMITTED FOR REVIEW':
      case 'SUBMITTED FOR APPROVAL':
        return (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                handleActionClick(sno, 'Cancelled', 'CANCELLED')
              }
            >
              Cancel Amendment
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/5"
              onClick={() =>
                handleActionClick(sno, 'Sent Back', 'DRAFT')
              }
            >
              Send Back For Changes
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                handleActionClick(sno, 'Completed', 'COMPLETED')
              }
            >
              Complete
            </Button>
          </>
        );
      case 'COMPLETED':
      case 'CANCELLED':
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by Agreement No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <span className="mr-2">Group By</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
            onClick={onOpenNewModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Amendment
          </Button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>S.No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Agreement/Grant No</TableHead>
              <TableHead>Amendment Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scopedAmendments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No amendments found.
                </TableCell>
              </TableRow>
            ) : (
              scopedAmendments.map((amendment) => {
                const isExpanded = expandedRow === amendment.sno;
                return (
                  <>
                    <TableRow
                      key={amendment.sno}
                      className={`
                        cursor-pointer transition-colors
                        ${isExpanded ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-gray-50'}
                      `}
                      onClick={() => toggleRow(amendment.sno)}
                    >
                      <TableCell>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>{amendment.sno}</TableCell>
                      <TableCell>{amendment.type}</TableCell>
                      <TableCell className="font-medium text-primary">
                        {amendment.agreementNo}
                      </TableCell>
                      <TableCell>{amendment.amendmentType}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${statusColors[amendment.status as keyof typeof statusColors] ||
                            'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {amendment.status}
                        </span>
                      </TableCell>
                      <TableCell>{amendment.createdAt}</TableCell>
                    </TableRow>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableCell colSpan={7} className="p-0">
                          <div className="p-6 border-b border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                              Amendment Details
                            </h4>

                            <dl className="grid grid-cols-2 gap-x-12 gap-y-6 mb-6">
                              {/* Common fields based on amendment type */}
                              {'oldDate' in amendment && (
                                <>
                                  <div className="col-span-1">
                                    <dt className="text-xs text-gray-500 mb-0.5">Old End Date</dt>
                                    <dd className="text-sm font-medium">{amendment.oldDate}</dd>
                                  </div>
                                  <div className="col-span-1">
                                    <dt className="text-xs text-gray-500 mb-0.5">New End Date</dt>
                                    <dd className="text-sm font-medium">{amendment.newDate}</dd>
                                  </div>
                                </>
                              )}

                              {'currentProject' in amendment && (
                                <>
                                  <div className="col-span-1">
                                    <dt className="text-xs text-gray-500 mb-0.5">Current Project</dt>
                                    <dd className="text-sm font-medium">{amendment.currentProject}</dd>
                                  </div>
                                  <div className="col-span-1">
                                    <dt className="text-xs text-gray-500 mb-0.5">New Project</dt>
                                    <dd className="text-sm font-medium">{amendment.newProject}</dd>
                                  </div>
                                </>
                              )}

                              {'comment' in amendment && (
                                <div className="col-span-2">
                                  <dt className="text-xs text-gray-500 mb-0.5">Comments</dt>
                                  <dd className="text-sm text-gray-700">{amendment.comment}</dd>
                                </div>
                              )}
                            </dl>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                              {getAmendmentActions(amendment.sno, amendment.status)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── New Amendment Dialog ───────────────────────────── */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Amendment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Amendment Type</Label>
                <Select
                  onValueChange={(val) =>
                    setValue('amendmentType', val as AmendmentType)
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agreement-no-cost-extension">
                      Agreement - No Cost Extension
                    </SelectItem>
                    <SelectItem value="agreement-amend-contribution-amount">
                      Agreement - Amend Contribution Amount
                    </SelectItem>
                    <SelectItem value="agreement-termination">
                      Agreement - Termination
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ── Conditional Fields ── */}
              {amendmentType === 'agreement-no-cost-extension' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4 border">
                  <h3 className="font-medium text-sm text-gray-900">
                    No Cost Extension Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Current End Date</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        {...register('currentEndDate')}
                      />
                    </div>
                    <div>
                      <Label>New End Date</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        {...register('newEndDate')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {amendmentType === 'agreement-amend-contribution-amount' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4 border">
                  <h3 className="font-medium text-sm text-gray-900">
                    Contribution Amount Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Contribution Amount</Label>
                      <Input
                        className="mt-1"
                        {...register('totalContributionAmount')}
                      />
                    </div>
                    <div>
                      <Label>Available Contribution Amount</Label>
                      <Input
                        className="mt-1"
                        {...register('availableContributionAmount')}
                      />
                    </div>
                    <div>
                      <Label>Amendment Type</Label>
                      <Select
                        onValueChange={(v) =>
                          setValue(
                            'contributionAdjustmentType',
                            v as 'top-up' | 'reduction'
                          )
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-up">Top Up</SelectItem>
                          <SelectItem value="reduction">Reduction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amendment Amount (USD)</Label>
                      <Input className="mt-1" {...register('adjustmentAmount')} />
                    </div>
                    <div>
                      <Label>Amount (USD)</Label>
                      <Input className="mt-1" {...register('amountUsd')} />
                    </div>
                  </div>
                </div>
              )}

              {amendmentType === 'agreement-termination' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4 border">
                  <h3 className="font-medium text-sm text-gray-900">
                    Termination Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Termination Date</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        {...register('terminationDate')}
                      />
                    </div>
                    <div>
                      <Label>Reason for Termination</Label>
                      <Textarea
                        placeholder="Please provide a reason..."
                        className="mt-1"
                        rows={3}
                        {...register('terminationReason')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments */}
              <div>
                <Label>Attachments</Label>
                <Input
                  type="file"
                  className="mt-1 cursor-pointer"
                  {...register('attachments')}
                />
              </div>

              {/* Comments */}
              <div>
                <Label>Comments</Label>
                <Textarea
                  placeholder="Additional comments..."
                  className="mt-1"
                  rows={3}
                  {...register('comments')}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Amendment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will change the status of the amendment to <strong>{actionDialog.newStatus}</strong>.
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

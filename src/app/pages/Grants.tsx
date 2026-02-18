import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import {
  Check,
  ChevronsUpDown,
  Plus,
  RefreshCw,
  RotateCcw,
  X,
  FileText,
  ArrowLeft,
  Clock,
} from 'lucide-react';
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

type GrantFormValues = {
  rGrantNumber: string;
  mGrantNumber?: string;
  costCenter: string;
  sponsoredProgram: string;
  projectId: string;
  unodcFocalPoint: string[];
  amount: string;
  amountUsd: string;
  comments?: string;
};

const UNODC_FOCAL_POINT_OPTIONS = [
  { value: 'fp1', label: 'Focal Point 1' },
  { value: 'fp2', label: 'Focal Point 2' },
  { value: 'fp3', label: 'Focal Point 3' },
  { value: 'fp4', label: 'Focal Point 4' },
];

// Local grants array removed to use MockDataContext

type GrantsProps = {
  embedded?: boolean;
  agreementId?: string;
};

/* ── Drawer tab types ────────────────────────────────────────── */
type DrawerTab = 'details' | 'amendments';

/* ── tiny field helper (matches AgreementDetails style) ─────── */
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

import { useUser } from '../context/UserContext';

export function Grants({ embedded = false, agreementId }: GrantsProps) {
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<any>(null);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('details');
  const { userRole } = useUser();
  const { grants, updateGrantStatus } = useMockData();

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: string;
    newStatus: string;
    grantSno?: number;
  }>({ open: false, action: '', newStatus: '' });

  /* amendment form inside drawer */
  const [showAmendmentForm, setShowAmendmentForm] = useState(false);
  const [selectedAmendmentType, setSelectedAmendmentType] = useState('');

  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<GrantFormValues>({
    defaultValues: {
      rGrantNumber: '',
      mGrantNumber: '',
      costCenter: '',
      sponsoredProgram: '',
      projectId: '',
      unodcFocalPoint: [],
      amount: '',
      amountUsd: '',
      comments: '',
    },
    mode: 'onBlur',
  });

  const costCenter = watch('costCenter');
  const sponsoredProgram = watch('sponsoredProgram');
  const projectId = watch('projectId');
  const unodcFocalPoint = watch('unodcFocalPoint');
  const [focalPointOpen, setFocalPointOpen] = useState(false);

  const onOpenGrantModal = () => {
    reset();
    setShowGrantModal(true);
  };

  const onRowClick = (grant: any) => {
    setSelectedGrant(grant);
    setDrawerTab('details');
    setShowAmendmentForm(false);
    setShowDrawer(true);
  };

  const onSubmitGrant = (values: GrantFormValues) => {
    void values;
    setShowGrantModal(false);
  };

  const selectPlaceholder = useMemo(() => 'Select', []);

  const scopedGrants = useMemo(() => {
    if (!agreementId) return grants;
    return grants.filter((g) => g.agreementId === agreementId);
  }, [agreementId, grants]);

  useEffect(() => {
    register('unodcFocalPoint', {
      validate: (v) => (v && v.length > 0 ? true : 'UNODC focal point is required'),
    });
  }, [register]);

  /* Is the selected grant approved? */
  const isApproved = selectedGrant?.status === 'Approved';

  const handleActionClick = (sno: number, action: string, newStatus: string) => {
    setActionDialog({ open: true, action, newStatus, grantSno: sno });
  };

  const confirmAction = () => {
    if (actionDialog.grantSno && actionDialog.newStatus) {
      updateGrantStatus(actionDialog.grantSno, actionDialog.newStatus);
      toast.success(`Grant ${actionDialog.action} successfully`);
      // Update local selected grant to reflect status change in UI
      const updated = grants.find(g => g.sno === actionDialog.grantSno);
      if (updated) setSelectedGrant({ ...updated, status: actionDialog.newStatus });

      setActionDialog({ open: false, action: '', newStatus: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY FOR UMOJA APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'SENT FOR UMOJA APPROVAL':
        return 'bg-purple-100 text-purple-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'PENDING SO ACTIONS':
        return 'bg-orange-100 text-orange-800';
      case 'SENT BACK FOR CHANGES':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrantActions = (status?: string) => {
    const backButton = (
      <Button
        variant="outline"
        size="sm"
        className="border-primary text-primary hover:bg-primary/5"
        onClick={() => setShowDrawer(false)}
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        Back to grants list
      </Button>
    );

    if (!selectedGrant) return backButton;

    if (userRole === 'FRMS') {
      switch (status) {
        case 'SENT FOR UMOJA APPROVAL':
          return (
            <>
              {backButton}
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleActionClick(
                    selectedGrant.sno,
                    'Sent back for changes',
                    'SENT BACK FOR CHANGES'
                  )
                }
              >
                Send back for changes
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                size="sm"
                onClick={() =>
                  handleActionClick(
                    selectedGrant.sno,
                    'Set to Pending SO',
                    'PENDING SO ACTIONS'
                  )
                }
              >
                Pending SO Action
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                onClick={() =>
                  handleActionClick(
                    selectedGrant.sno,
                    'Awarded',
                    'Approved'
                  )
                }
              >
                Award operational
              </Button>
            </>
          );
        default:
          return backButton;
      }
    }

    switch (status) {
      case 'DRAFT':
      case 'SENT BACK FOR CHANGES':
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
                handleActionClick(
                  selectedGrant.sno,
                  'Submitted',
                  'READY FOR UMOJA APPROVAL'
                )
              }
            >
              Submit For Review
            </Button>
          </>
        );
      case 'READY FOR UMOJA APPROVAL':
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
              onClick={() =>
                handleActionClick(selectedGrant.sno, 'Cancelled', 'CANCELLED')
              }
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                handleActionClick(
                  selectedGrant.sno,
                  'Sent for Umoja',
                  'SENT FOR UMOJA APPROVAL'
                )
              }
            >
              Send for Umoja Approval
            </Button>
          </>
        );
      case 'Approved':
      case 'PENDING SO ACTIONS':
      case 'SENT FOR UMOJA APPROVAL':
      case 'CANCELLED':
      default:
        return backButton;
    }
  };

  return (
    <div className="space-y-6">
      {/* Grants Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
            onClick={onOpenGrantModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Agreement ID</TableHead>
                <TableHead>R Grant Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount in EUR</TableHead>
                <TableHead>Amount In USD</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scopedGrants.map((grant) => (
                <TableRow
                  key={grant.sno}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onRowClick(grant)}
                >
                  <TableCell>{grant.sno}</TableCell>
                  <TableCell className="text-primary">{grant.agreementId}</TableCell>
                  <TableCell>{grant.rGrantNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(grant.status)}`}>
                      {grant.status}
                    </span>
                  </TableCell>
                  <TableCell>{grant.amount}</TableCell>
                  <TableCell>{grant.amountUSD}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-end">
              <span className="text-sm">
                <strong>Total:</strong> ${scopedGrants.reduce((s, g) => s + parseFloat(g.amountUSD || '0'), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Grant Modal (keep as Dialog) ─────────────────── */}
      <Dialog open={showGrantModal} onOpenChange={setShowGrantModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Grant</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new grant with required fields and optional focal points.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitGrant)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r-grant-number">
                  Grant number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="r-grant-number"
                  className="mt-1"
                  {...register('rGrantNumber', { required: 'Grant number is required' })}
                />
                {errors.rGrantNumber?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.rGrantNumber.message}</p>
                )}
              </div>

              {watch('rGrantNumber')?.[0]?.toUpperCase() !== 'S' && (
                <div>
                  <Label htmlFor="m-grant-number">M-Grant number</Label>
                  <Input
                    id="m-grant-number"
                    className="mt-1"
                    {...register('mGrantNumber')}
                  />
                </div>
              )}
            </div>

            <div>
              <Label className="text-gray-700">
                Cost center <span className="text-red-500">*</span>
              </Label>
              <Select
                value={costCenter || ''}
                onValueChange={(v) => setValue('costCenter', v, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc1">Cost Center 1</SelectItem>
                  <SelectItem value="cc2">Cost Center 2</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('costCenter', { required: 'Cost center is required' })} />
              {errors.costCenter?.message && (
                <p className="text-xs text-red-500 mt-1">{errors.costCenter.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">
                  Sponsored program <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={sponsoredProgram || ''}
                  onValueChange={(v) =>
                    setValue('sponsoredProgram', v, { shouldValidate: true, shouldDirty: true })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp1">Sponsored Program 1</SelectItem>
                    <SelectItem value="sp2">Sponsored Program 2</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register('sponsoredProgram', { required: 'Sponsored program is required' })}
                />
                {errors.sponsoredProgram?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.sponsoredProgram.message}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700">
                  Project id <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={projectId || ''}
                  onValueChange={(v) => setValue('projectId', v, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">Project 1</SelectItem>
                    <SelectItem value="p2">Project 2</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('projectId', { required: 'Project id is required' })} />
                {errors.projectId?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.projectId.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-700">
                UNODC focal point <span className="text-red-500">*</span>
              </Label>
              <Popover open={focalPointOpen} onOpenChange={setFocalPointOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={focalPointOpen}
                    onClick={() => setFocalPointOpen((v) => !v)}
                    className="mt-1 w-full justify-between"
                  >
                    {unodcFocalPoint.length
                      ? `${unodcFocalPoint.length} selected`
                      : 'Select Focal Point(s)'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="z-[60] w-[--radix-popover-trigger-width] overflow-hidden p-0"
                  align="start"
                >
                  <Command className="w-full">
                    <CommandInput placeholder="Search focal points..." />
                    <CommandList className="max-h-56">
                      <CommandEmpty>No focal points found.</CommandEmpty>
                      {UNODC_FOCAL_POINT_OPTIONS.map((opt) => {
                        const selected = unodcFocalPoint.includes(opt.value);
                        return (
                          <CommandItem
                            key={opt.value}
                            value={`${opt.value} ${opt.label}`}
                            onSelect={() => {
                              const next = selected
                                ? unodcFocalPoint.filter((v) => v !== opt.value)
                                : [...unodcFocalPoint, opt.value];
                              setValue('unodcFocalPoint', next, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                          >
                            <Check className={selected ? 'opacity-100' : 'opacity-0'} />
                            {opt.label}
                          </CommandItem>
                        );
                      })}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.unodcFocalPoint?.message && (
                <p className="text-xs text-red-500 mt-1">{String(errors.unodcFocalPoint.message)}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-gray-700">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  className="mt-1"
                  {...register('amount', { required: 'Amount is required' })}
                />
                {errors.amount?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="amount-usd" className="text-gray-700">
                  Amount in USD <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount-usd"
                  type="number"
                  step="0.01"
                  className="mt-1"
                  {...register('amountUsd', { required: 'Amount in USD is required' })}
                />
                {errors.amountUsd?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.amountUsd.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="comments">Comment (if any)</Label>
              <Textarea id="comments" className="mt-1" rows={3} {...register('comments')} />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowGrantModal(false)}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Grant Detail Drawer (Sheet) ──────────────────────── */}
      <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
        <SheetContent
          side="right"
          className="!w-[calc(100vw-320px)] !max-w-none p-0 flex flex-col [&>button]:hidden"
        >
          {/* Accessible title (hidden, covered by custom header) */}
          <SheetTitle className="sr-only">
            Grant Details
          </SheetTitle>
          <SheetDescription className="sr-only">
            View and manage grant details
          </SheetDescription>

          {/* ── Blue header ──────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-primary text-white shrink-0">
            <span className="font-medium text-sm">Grant</span>
            <button
              onClick={() => setShowDrawer(false)}
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Tabs row ─────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 border-b border-gray-200 shrink-0">
            <div className="flex">
              <button
                onClick={() => { setDrawerTab('details'); setShowAmendmentForm(false); }}
                className={`
                  px-4 py-2.5 text-sm font-medium transition-colors relative
                  ${drawerTab === 'details' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                📄 Details
                {drawerTab === 'details' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
                )}
              </button>

              {/* Amendments tab — only for APPROVED grants */}
              {isApproved && (
                <button
                  onClick={() => setDrawerTab('amendments')}
                  className={`
                    px-4 py-2.5 text-sm font-medium transition-colors relative
                    ${drawerTab === 'amendments' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  Amendments
                  {drawerTab === 'amendments' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
                  )}
                </button>
              )}
            </div>

            {/* History icon */}
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors">
              <Clock className="w-4 h-4" />
            </button>
          </div>

          {/* ── Scrollable content ───────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {/* ── Details tab ────────────────────────────────── */}
            {drawerTab === 'details' && (
              <div className="p-6 space-y-6">
                {/* Field grid */}
                <dl className="grid grid-cols-2 gap-x-10 gap-y-5">
                  <FieldRow label="Agreement Id" value={selectedGrant?.agreementId} />
                  <FieldRow label="R Grant Number" value={selectedGrant?.rGrantNumber} />
                  <FieldRow label="M Grant Number" value={selectedGrant?.mGrantNumber} />
                  <FieldRow label="Cost Center" value={selectedGrant?.costCenter} />
                  <FieldRow label="Sponsor Programme" value={selectedGrant?.sponsoredProgram} />
                  <FieldRow label="Project Number" value={selectedGrant?.projectId} />
                  <FieldRow
                    label="Amount"
                    value={selectedGrant ? `${selectedGrant.amount}` : '—'}
                  />
                  <FieldRow
                    label="Amount in USD"
                    value={selectedGrant?.amountUSD}
                  />
                </dl>

                {/* Focal Points */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs text-gray-500 mb-2">Focal Points</h4>
                  {selectedGrant?.focalPoints?.length ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                      {selectedGrant.focalPoints.map((fp: any, i: number) => (
                        <div key={i}>
                          <p className="text-sm font-semibold text-gray-900">{fp.name}</p>
                          <p className="text-xs text-primary">{fp.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No focal points</p>
                  )}
                </div>

                {/* Comments */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs text-gray-500 mb-1">Comments</h4>
                  <p className="text-sm text-gray-900">{selectedGrant?.comments || '—'}</p>
                </div>

                {/* Status */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs text-gray-500 mb-1">Status</h4>
                  <p className="text-sm text-gray-900">{selectedGrant?.status || '—'}</p>
                </div>

                {/* Document Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Document</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5 mb-3"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Upload
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No documents found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* ── Amendments tab (only for APPROVED) ─────────── */}
            {drawerTab === 'amendments' && isApproved && (
              <div className="p-6 space-y-4">
                {!showAmendmentForm ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setShowAmendmentForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>S.No.</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created at</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500">
                            No data found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <Label>Amendment Type</Label>
                      <div className="mt-1 p-2 bg-gray-50 border rounded-md">
                        <p className="font-medium">Grant Re-programming</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Amendment Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Current Project</Label>
                          <p className="mt-1 font-medium">{selectedGrant?.projectId || '—'}</p>
                        </div>
                        <div>
                          <Label htmlFor="available-project">Available Project</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gloz31">GLOZ31</SelectItem>
                              <SelectItem value="gloz32">GLOZ32</SelectItem>
                              <SelectItem value="gloz33">GLOZ33</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Current Cost-center</Label>
                          <p className="mt-1 font-medium">{selectedGrant?.costCenter || '—'}</p>
                        </div>
                        <div>
                          <Label htmlFor="available-cost-center">Available Cost-Center</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select cost-center" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cc1">Cost Center 1</SelectItem>
                              <SelectItem value="cc2">Cost Center 2</SelectItem>
                              <SelectItem value="cc3">Cost Center 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Current Sponsor-Programme</Label>
                          <p className="mt-1 font-medium">{selectedGrant?.sponsoredProgram || '—'}</p>
                        </div>
                        <div>
                          <Label htmlFor="available-sponsor-programme">Available Sponsor-Programme</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select sponsor programme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wildlife">Wildlife and Forest Crime</SelectItem>
                              <SelectItem value="drugs">Drug Prevention</SelectItem>
                              <SelectItem value="terrorism">Terrorism Prevention</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 italic">
                        At least one of Project, Cost Center, or Sponsor Programme must be filled.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="attachment">Attachment (Max. Size 20MB)</Label>
                      <div className="mt-1">
                        <input
                          type="file"
                          id="attachment"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="amendment-comments">Comments</Label>
                      <Textarea
                        id="amendment-comments"
                        placeholder="Enter your comments here..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAmendmentForm(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setShowAmendmentForm(false)}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Bottom action buttons (details tab only) ─────── */}
          {drawerTab === 'details' && (
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-white shrink-0">
              {getGrantActions(selectedGrant?.status)}
            </div>
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will change the status of the grant to <strong>{actionDialog.newStatus}</strong>.
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

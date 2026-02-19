import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
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
import { Textarea } from '../components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { ArrowLeft, Check, ChevronsUpDown, Plus } from 'lucide-react';

type PartnerFormValues = {
  partnerType: string;
  partnerSubType?: string;
  originCountry: string;
  partnerName: string;
  parentPartner?: string;
  subPartner?: string;
  externalCode?: string;
  sourceWithinPartner?: string;
  reference?: string;
  bpNumber?: string;
  focalPoint: string[];
  contactPointName?: string;
  contactPointTitle?: string;
  contactPointEmail?: string;
  contactPointText?: string;
};

type PartnerRecord = {
  sno: number;
  name: string;
  bpNumber: string;
  type: string;
  subType: string;
  origin: string;
  parent: string;
};

type CreatePartnerProps = {
  embedded?: boolean;
  onCreated?: (partner: PartnerRecord) => void;
  onCancel?: () => void;
};

const STORAGE_KEY = 'pams_partners';

const MOCK_PARTNER_NAMES = [
  '1QB INFORMATION TECHNOLOGIES INC',
  'Abu Dhabi Police',
  'Acción Social',
  'Administrative Control and Transparency Authority',
  'African Development Bank Group - AfDB',
  'European Bank for Reconstruction and Development',
  'UNAIDS',
  'World Bank',
  'UNICEF',
  'WHO',
];

const MOCK_PARENT_PARTNER_NAMES = [
  'United Arab Emirates',
  'Qatar',
  'European Union',
  'United States',
  'United Kingdom',
];

const COUNTRY_OPTIONS = [
  { value: 'afghanistan', label: 'Afghanistan' },
  { value: 'albania', label: 'Albania' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'andorra', label: 'Andorra' },
  { value: 'angola', label: 'Angola' },
  { value: 'antigua-and-barbuda', label: 'Antigua and Barbuda' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'armenia', label: 'Armenia' },
  { value: 'australia', label: 'Australia' },
  { value: 'austria', label: 'Austria' },
  { value: 'azerbaijan', label: 'Azerbaijan' },
  { value: 'bahamas', label: 'Bahamas' },
  { value: 'bahrain', label: 'Bahrain' },
  { value: 'bangladesh', label: 'Bangladesh' },
  { value: 'barbados', label: 'Barbados' },
  { value: 'belarus', label: 'Belarus' },
  { value: 'belgium', label: 'Belgium' },
  { value: 'belize', label: 'Belize' },
  { value: 'benin', label: 'Benin' },
  { value: 'bhutan', label: 'Bhutan' },
  { value: 'bolivia', label: 'Bolivia' },
  { value: 'bosnia-and-herzegovina', label: 'Bosnia and Herzegovina' },
  { value: 'botswana', label: 'Botswana' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'brunei', label: 'Brunei' },
  { value: 'bulgaria', label: 'Bulgaria' },
  { value: 'burkina-faso', label: 'Burkina Faso' },
  { value: 'burundi', label: 'Burundi' },
  { value: 'cabo-verde', label: 'Cabo Verde' },
  { value: 'cambodia', label: 'Cambodia' },
  { value: 'cameroon', label: 'Cameroon' },
  { value: 'canada', label: 'Canada' },
  { value: 'central-african-republic', label: 'Central African Republic' },
  { value: 'chad', label: 'Chad' },
  { value: 'chile', label: 'Chile' },
  { value: 'china', label: 'China' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'comoros', label: 'Comoros' },
  { value: 'congo-democratic-republic', label: 'Congo (Democratic Republic)' },
  { value: 'congo-republic', label: 'Congo (Republic)' },
  { value: 'costa-rica', label: 'Costa Rica' },
  { value: 'cote-divoire', label: "Côte d'Ivoire" },
  { value: 'croatia', label: 'Croatia' },
  { value: 'cuba', label: 'Cuba' },
  { value: 'cyprus', label: 'Cyprus' },
  { value: 'czechia', label: 'Czechia' },
  { value: 'denmark', label: 'Denmark' },
  { value: 'djibouti', label: 'Djibouti' },
  { value: 'dominica', label: 'Dominica' },
  { value: 'dominican-republic', label: 'Dominican Republic' },
  { value: 'ecuador', label: 'Ecuador' },
  { value: 'egypt', label: 'Egypt' },
  { value: 'el-salvador', label: 'El Salvador' },
  { value: 'equatorial-guinea', label: 'Equatorial Guinea' },
  { value: 'eritrea', label: 'Eritrea' },
  { value: 'estonia', label: 'Estonia' },
  { value: 'eswatini', label: 'Eswatini' },
  { value: 'ethiopia', label: 'Ethiopia' },
  { value: 'fiji', label: 'Fiji' },
  { value: 'finland', label: 'Finland' },
  { value: 'france', label: 'France' },
  { value: 'gabon', label: 'Gabon' },
  { value: 'gambia', label: 'Gambia' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'germany', label: 'Germany' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'greece', label: 'Greece' },
  { value: 'grenada', label: 'Grenada' },
  { value: 'guatemala', label: 'Guatemala' },
  { value: 'guinea', label: 'Guinea' },
  { value: 'guinea-bissau', label: 'Guinea-Bissau' },
  { value: 'guyana', label: 'Guyana' },
  { value: 'haiti', label: 'Haiti' },
  { value: 'honduras', label: 'Honduras' },
  { value: 'hungary', label: 'Hungary' },
  { value: 'iceland', label: 'Iceland' },
  { value: 'india', label: 'India' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'iran', label: 'Iran' },
  { value: 'iraq', label: 'Iraq' },
  { value: 'ireland', label: 'Ireland' },
  { value: 'israel', label: 'Israel' },
  { value: 'italy', label: 'Italy' },
  { value: 'jamaica', label: 'Jamaica' },
  { value: 'japan', label: 'Japan' },
  { value: 'jordan', label: 'Jordan' },
  { value: 'kazakhstan', label: 'Kazakhstan' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'kiribati', label: 'Kiribati' },
  { value: 'korea-north', label: 'Korea (North)' },
  { value: 'korea-south', label: 'Korea (South)' },
  { value: 'kosovo', label: 'Kosovo' },
  { value: 'kuwait', label: 'Kuwait' },
  { value: 'kyrgyzstan', label: 'Kyrgyzstan' },
  { value: 'laos', label: 'Laos' },
  { value: 'latvia', label: 'Latvia' },
  { value: 'lebanon', label: 'Lebanon' },
  { value: 'lesotho', label: 'Lesotho' },
  { value: 'liberia', label: 'Liberia' },
  { value: 'libya', label: 'Libya' },
  { value: 'liechtenstein', label: 'Liechtenstein' },
  { value: 'lithuania', label: 'Lithuania' },
  { value: 'luxembourg', label: 'Luxembourg' },
  { value: 'madagascar', label: 'Madagascar' },
  { value: 'malawi', label: 'Malawi' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'maldives', label: 'Maldives' },
  { value: 'mali', label: 'Mali' },
  { value: 'malta', label: 'Malta' },
  { value: 'marshall-islands', label: 'Marshall Islands' },
  { value: 'mauritania', label: 'Mauritania' },
  { value: 'mauritius', label: 'Mauritius' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'micronesia', label: 'Micronesia' },
  { value: 'moldova', label: 'Moldova' },
  { value: 'monaco', label: 'Monaco' },
  { value: 'mongolia', label: 'Mongolia' },
  { value: 'montenegro', label: 'Montenegro' },
  { value: 'morocco', label: 'Morocco' },
  { value: 'mozambique', label: 'Mozambique' },
  { value: 'myanmar', label: 'Myanmar' },
  { value: 'namibia', label: 'Namibia' },
  { value: 'nauru', label: 'Nauru' },
  { value: 'nepal', label: 'Nepal' },
  { value: 'netherlands', label: 'Netherlands' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'nicaragua', label: 'Nicaragua' },
  { value: 'niger', label: 'Niger' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'north-macedonia', label: 'North Macedonia' },
  { value: 'norway', label: 'Norway' },
  { value: 'oman', label: 'Oman' },
  { value: 'pakistan', label: 'Pakistan' },
  { value: 'palau', label: 'Palau' },
  { value: 'palestine', label: 'Palestine' },
  { value: 'panama', label: 'Panama' },
  { value: 'papua-new-guinea', label: 'Papua New Guinea' },
  { value: 'paraguay', label: 'Paraguay' },
  { value: 'peru', label: 'Peru' },
  { value: 'philippines', label: 'Philippines' },
  { value: 'poland', label: 'Poland' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'qatar', label: 'Qatar' },
  { value: 'romania', label: 'Romania' },
  { value: 'russia', label: 'Russia' },
  { value: 'rwanda', label: 'Rwanda' },
  { value: 'saint-kitts-and-nevis', label: 'Saint Kitts and Nevis' },
  { value: 'saint-lucia', label: 'Saint Lucia' },
  { value: 'saint-vincent-and-the-grenadines', label: 'Saint Vincent and the Grenadines' },
  { value: 'samoa', label: 'Samoa' },
  { value: 'san-marino', label: 'San Marino' },
  { value: 'sao-tome-and-principe', label: 'São Tomé and Príncipe' },
  { value: 'saudi-arabia', label: 'Saudi Arabia' },
  { value: 'senegal', label: 'Senegal' },
  { value: 'serbia', label: 'Serbia' },
  { value: 'seychelles', label: 'Seychelles' },
  { value: 'sierra-leone', label: 'Sierra Leone' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'slovakia', label: 'Slovakia' },
  { value: 'slovenia', label: 'Slovenia' },
  { value: 'solomon-islands', label: 'Solomon Islands' },
  { value: 'somalia', label: 'Somalia' },
  { value: 'south-africa', label: 'South Africa' },
  { value: 'south-sudan', label: 'South Sudan' },
  { value: 'spain', label: 'Spain' },
  { value: 'sri-lanka', label: 'Sri Lanka' },
  { value: 'sudan', label: 'Sudan' },
  { value: 'suriname', label: 'Suriname' },
  { value: 'sweden', label: 'Sweden' },
  { value: 'switzerland', label: 'Switzerland' },
  { value: 'syria', label: 'Syria' },
  { value: 'taiwan', label: 'Taiwan' },
  { value: 'tajikistan', label: 'Tajikistan' },
  { value: 'tanzania', label: 'Tanzania' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'timor-leste', label: 'Timor-Leste' },
  { value: 'togo', label: 'Togo' },
  { value: 'tonga', label: 'Tonga' },
  { value: 'trinidad-and-tobago', label: 'Trinidad and Tobago' },
  { value: 'tunisia', label: 'Tunisia' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'turkmenistan', label: 'Turkmenistan' },
  { value: 'tuvalu', label: 'Tuvalu' },
  { value: 'uganda', label: 'Uganda' },
  { value: 'ukraine', label: 'Ukraine' },
  { value: 'united-arab-emirates', label: 'United Arab Emirates' },
  { value: 'united-kingdom', label: 'United Kingdom' },
  { value: 'united-states', label: 'United States' },
  { value: 'uruguay', label: 'Uruguay' },
  { value: 'uzbekistan', label: 'Uzbekistan' },
  { value: 'vanuatu', label: 'Vanuatu' },
  { value: 'vatican-city', label: 'Vatican City' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'yemen', label: 'Yemen' },
  { value: 'zambia', label: 'Zambia' },
  { value: 'zimbabwe', label: 'Zimbabwe' },
];

const FOCAL_POINT_OPTIONS = [
  { value: 'fp-1', label: 'CPS Focal Point 1' },
  { value: 'fp-2', label: 'CPS Focal Point 2' },
  { value: 'fp-3', label: 'CPS Focal Point 3' },
];

function safeReadPartnersFromStorage(): PartnerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => p && typeof p === 'object') as PartnerRecord[];
  } catch {
    return [];
  }
}

function safeWritePartnersToStorage(items: PartnerRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    void 0;
  }
}

function labelToValue(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function partnerTypeLabel(v: string) {
  switch (v) {
    case 'private-sector':
      return 'Private Sector';
    case 'member-states-eu':
      return 'Member States and EU';
    case 'multi-partner-trust-fund':
      return 'Multi-Partner Trust Fund';
    case 'international-financial-institutions':
      return 'International financial institutions';
    case 'un-agencies-international-org':
      return 'UN Agencies and International organisation';
    default:
      return v;
  }
}

function partnerSubTypeLabel(v: string) {
  switch (v) {
    case 'academia':
      return 'Academia';
    case 'corporation':
      return 'Corporation';
    case 'foundation':
      return 'Foundation';
    case 'individual':
      return 'Individual';
    case 'ngo':
      return 'NGO';
    default:
      return v;
  }
}

function originLabel(v: string) {
  if (v === 'global') return 'Global';
  if (v === 'european-union') return 'European Union';
  const match = COUNTRY_OPTIONS.find((c) => c.value === v);
  return match?.label || v;
}

export function CreatePartner({ embedded = false, onCreated, onCancel }: CreatePartnerProps) {
  const navigate = useNavigate();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerFormValues>({
    defaultValues: {
      partnerType: '',
      partnerSubType: '',
      originCountry: '',
      partnerName: '',
      parentPartner: '',
      subPartner: '',
      externalCode: '',
      sourceWithinPartner: '',
      reference: '',
      bpNumber: '',
      focalPoint: [],
      contactPointName: '',
      contactPointTitle: '',
      contactPointEmail: '',
      contactPointText: '',
    },
    mode: 'onBlur',
  });

  const partnerType = watch('partnerType');
  const partnerSubType = watch('partnerSubType') || '';
  const originCountry = watch('originCountry') || '';
  const focalPoint = watch('focalPoint');
  const [focalPointOpen, setFocalPointOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogKind, setAddDialogKind] = useState<'partnerName' | 'parentPartner' | 'subPartner'>('partnerName');
  const [newName, setNewName] = useState('');

  const storedPartners = useMemo(() => safeReadPartnersFromStorage(), []);

  useEffect(() => {
    register('focalPoint');
  }, [register]);

  const nameOptions = useMemo(() => {
    const seed = [...MOCK_PARTNER_NAMES, ...storedPartners.map((p) => p.name)];
    const unique = Array.from(new Set(seed)).filter(Boolean).sort();
    return unique;
  }, [storedPartners]);

  const parentOptions = useMemo(() => {
    const seed = [...MOCK_PARENT_PARTNER_NAMES, ...storedPartners.map((p) => p.parent)];
    const unique = Array.from(new Set(seed)).filter(Boolean).sort();
    return unique;
  }, [storedPartners]);

  const originOptions = useMemo(() => {
    if (partnerType === 'member-states-eu') {
      return [{ value: 'european-union', label: 'European Union' }, ...COUNTRY_OPTIONS];
    }
    return [{ value: 'global', label: 'Global' }];
  }, [partnerType]);

  const openAddDialog = (kind: 'partnerName' | 'parentPartner' | 'subPartner') => {
    setAddDialogKind(kind);
    setNewName('');
    setAddDialogOpen(true);
  };

  const confirmAddName = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setValue(addDialogKind, trimmed, { shouldValidate: true, shouldDirty: true });
    setAddDialogOpen(false);
  };

  const onSubmit = (values: PartnerFormValues) => {
    const existing = safeReadPartnersFromStorage();
    const nextSno = existing.length > 0 ? Math.max(...existing.map((p) => p.sno || 0)) + 1 : 1;

    const record: PartnerRecord = {
      sno: nextSno,
      name: values.partnerName,
      bpNumber: values.bpNumber || '',
      type: partnerTypeLabel(values.partnerType),
      subType: values.partnerType === 'private-sector' ? partnerSubTypeLabel(values.partnerSubType || '') : '',
      origin: originLabel(values.originCountry),
      parent: values.parentPartner || values.partnerName,
    };

    safeWritePartnersToStorage([...existing, record]);

    if (embedded) {
      onCreated?.(record);
      return;
    }

    navigate('/partners');
  };

  return (
    <div className="space-y-6">
      {!embedded && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Create Partner</h1>
          <Button variant="outline" onClick={() => navigate('/partners')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg mb-4">Partner Details</h3>
          <div className={`grid gap-6 ${embedded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <div>
              <Label className="text-gray-700">
                Partner Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={partnerType}
                onValueChange={(v) => {
                  setValue('partnerType', v, { shouldValidate: true, shouldDirty: true });
                  if (v !== 'private-sector') {
                    setValue('partnerSubType', '', { shouldValidate: true, shouldDirty: true });
                  }
                  setValue('originCountry', '', { shouldValidate: true, shouldDirty: true });
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Please Select Partner Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private-sector">Private Sector</SelectItem>
                  <SelectItem value="member-states-eu">Member States and EU</SelectItem>
                  <SelectItem value="multi-partner-trust-fund">Multi-Partner Trust Fund</SelectItem>
                  <SelectItem value="international-financial-institutions">International financial institutions</SelectItem>
                  <SelectItem value="un-agencies-international-org">UN Agencies and International organisation</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('partnerType', { required: 'Partner type is required' })} />
              {errors.partnerType?.message && <p className="text-xs text-red-500 mt-1">{errors.partnerType.message}</p>}
            </div>

            {partnerType === 'private-sector' && (
              <div>
                <Label className="text-gray-700">Sub-Type</Label>
                <Select
                  value={partnerSubType}
                  onValueChange={(v) => setValue('partnerSubType', v, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Sub-Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academia">Academia</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('partnerSubType')} />
              </div>
            )}

            <div>
              <Label className="text-gray-700">
                Origin/Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={originCountry}
                onValueChange={(v) => setValue('originCountry', v, { shouldValidate: true, shouldDirty: true })}
                disabled={!partnerType}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={partnerType ? 'Select Origin/Country' : 'Select Partner Type first'} />
                </SelectTrigger>
                <SelectContent>
                  {originOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('originCountry', { required: 'Origin/Country is required' })} />
              {errors.originCountry?.message && (
                <p className="text-xs text-red-500 mt-1">{errors.originCountry.message}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-700">
                Partner Name <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={watch('partnerName') || ''}
                  onValueChange={(v) => setValue('partnerName', v, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {nameOptions.map((n) => (
                      <SelectItem key={labelToValue(n)} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" type="button" onClick={() => openAddDialog('partnerName')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              </div>
              <input type="hidden" {...register('partnerName', { required: 'Partner name is required' })} />
              {errors.partnerName?.message && (
                <p className="text-xs text-red-500 mt-1">{errors.partnerName.message}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-700">Parent Partner</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={watch('parentPartner') || ''}
                  onValueChange={(v) => setValue('parentPartner', v, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select Parent Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((n) => (
                      <SelectItem key={labelToValue(n)} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" type="button" onClick={() => openAddDialog('parentPartner')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              </div>
              <input type="hidden" {...register('parentPartner')} />
            </div>

            <div>
              <Label className="text-gray-700">Sub-Partner</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={watch('subPartner') || ''}
                  onValueChange={(v) => setValue('subPartner', v, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select Sub-Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {nameOptions.map((n) => (
                      <SelectItem key={labelToValue(n)} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" type="button" onClick={() => openAddDialog('subPartner')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              </div>
              <input type="hidden" {...register('subPartner')} />
            </div>

            <div>
              <Label htmlFor="external-code" className="text-gray-700">
                External Code
              </Label>
              <Input id="external-code" className="mt-1" {...register('externalCode')} />
            </div>

            <div>
              <Label htmlFor="source-within-partner" className="text-gray-700">
                Source within Partner
              </Label>
              <Input id="source-within-partner" className="mt-1" {...register('sourceWithinPartner')} />
            </div>

            <div>
              <Label htmlFor="reference" className="text-gray-700">
                Reference
              </Label>
              <Input id="reference" className="mt-1" {...register('reference')} />
            </div>

            <div>
              <Label htmlFor="bp-number" className="text-gray-700">
                BP Number
              </Label>
              <Input id="bp-number" className="mt-1" {...register('bpNumber')} />
            </div>

            <div>
              <Label className="text-gray-700">Focal Points</Label>
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
                    {focalPoint.length ? `${focalPoint.length} selected` : 'Select Focal Point(s)'}
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
                      {FOCAL_POINT_OPTIONS.map((opt) => {
                        const selected = focalPoint.includes(opt.value);
                        return (
                          <CommandItem
                            key={opt.value}
                            value={`${opt.value} ${opt.label}`}
                            onSelect={() => {
                              const next = selected
                                ? focalPoint.filter((v) => v !== opt.value)
                                : [...focalPoint, opt.value];
                              setValue('focalPoint', next, { shouldValidate: true, shouldDirty: true });
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg mb-4">Contact point of donor</h3>
          <div className={`grid gap-6 ${embedded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <div>
              <Label htmlFor="contact-name" className="text-gray-700">
                Name
              </Label>
              <Input id="contact-name" className="mt-1" {...register('contactPointName')} />
            </div>
            <div>
              <Label htmlFor="contact-title" className="text-gray-700">
                Title
              </Label>
              <Input id="contact-title" className="mt-1" {...register('contactPointTitle')} />
            </div>
            <div>
              <Label htmlFor="contact-email" className="text-gray-700">
                E-mail
              </Label>
              <Input
                id="contact-email"
                type="email"
                className="mt-1"
                {...register('contactPointEmail', {
                  pattern: {
                    value: /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              {errors.contactPointEmail?.message && (
                <p className="text-xs text-red-500 mt-1">{errors.contactPointEmail.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="contact-text" className="text-gray-700">
                Comments
              </Label>
              <Textarea id="contact-text" className="mt-1" rows={4} {...register('contactPointText')} />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (embedded) {
                onCancel?.();
                return;
              }
              navigate('/partners');
            }}
          >
            Cancel
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
            Submit
          </Button>
        </div>
      </form>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-gray-700">Name</Label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmAddName}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

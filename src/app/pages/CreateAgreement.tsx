import { useMemo, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ArrowLeft, Plus } from 'lucide-react';
import { CreatePartner } from './CreatePartner';

type AgreementFormValues = {
  partnerType: string;
  partnerSubType?: string;
  originCountry: string;
  partnerName: string;
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
  attachments: FileList;
};

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

const PURPOSE_OF_FUNDING_OPTIONS = [
  { value: 'general-purpose-gp', label: 'General Purpose (GP)' },
  { value: 'cost-sharing', label: 'Special Purspose (SP)' },
  // { value: 'project-specific', label: 'Project specific' },
];

export function CreateAgreement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('agreement');
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AgreementFormValues>({
    defaultValues: {
      partnerType: '',
      partnerSubType: '',
      originCountry: '',
      partnerName: '',
      signatureDate: '',
      startDate: '',
      endDate: '',
      agreementType: '',
      currency: '',
      exchangeRate: '',
      amount: '',
      amountUsd: '',
      purposeOfFunding: '',
      costSharing: '',
      termsAndConditions: '',
      treatmentOfInterest: '',
      treatmentOfUnspentBalance: '',
      comments: '',
    },
    mode: 'onBlur',
  });

  const partnerType = watch('partnerType');
  const signatureDate = watch('signatureDate');

  const originOptions = useMemo(() => {
    if (partnerType === 'member-states-eu') {
      return [
        { value: 'european-union', label: 'European Union' },
        ...COUNTRY_OPTIONS,
      ];
    }

    return [{ value: 'global', label: 'Global' }];
  }, [partnerType]);

  const onSubmit = (values: AgreementFormValues) => {
    // Prototype-only behavior: just return to agreements list.
    // Data persistence/workflow will be wired later.
    void values;
    navigate('/agreements');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Create Agreement</h1>
        <Button variant="outline" onClick={() => navigate('/agreements')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border-b">
          <TabsTrigger value="agreement" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
            📄 Agreement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agreement" className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Partner Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg mb-4">Partner Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectItem value="international-financial-institutions">
                        Internation Financial Institutions
                      </SelectItem>
                      <SelectItem value="member-states-eu">Member States and EU</SelectItem>
                      <SelectItem value="multi-partner-trust-fund">Multi-Partner Trust Fund</SelectItem>
                      <SelectItem value="private-sector">Private Sector</SelectItem>
                      <SelectItem value="un-agencies-international-org">
                        UN Agencies and International Organization
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('partnerType', { required: 'Partner type is required' })} />
                  {errors.partnerType?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.partnerType.message}</p>
                  )}
                </div>

                {partnerType === 'private-sector' && (
                  <div>
                    <Label className="text-gray-700">Partner Sub-Type</Label>
                    <Select
                      value={watch('partnerSubType') || ''}
                      onValueChange={(v) =>
                        setValue('partnerSubType', v, { shouldValidate: true, shouldDirty: true })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Sub-Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academia">Academia</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="ngos">NGOs</SelectItem>
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
                    value={watch('originCountry') || ''}
                    onValueChange={(v) =>
                      setValue('originCountry', v, { shouldValidate: true, shouldDirty: true })
                    }
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
                  <input
                    type="hidden"
                    {...register('originCountry', { required: 'Origin/Country is required' })}
                  />
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
                        <SelectItem value="European Bank for Reconstruction and Development">
                          European Bank for Reconstruction and Development
                        </SelectItem>
                        <SelectItem value="African Development Bank Group - AfDB">
                          African Development Bank Group - AfDB
                        </SelectItem>
                        <SelectItem value="UNAIDS">UNAIDS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" type="button" onClick={() => setPartnerDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add New Partner
                    </Button>
                  </div>
                  <input type="hidden" {...register('partnerName', { required: 'Partner name is required' })} />
                  {errors.partnerName?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.partnerName.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
              <DialogContent className="w-full max-w-7xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Partner</DialogTitle>
                </DialogHeader>
                <CreatePartner
                  embedded
                  onCancel={() => setPartnerDialogOpen(false)}
                  onCreated={(partner) => {
                    setValue('partnerName', partner.name, { shouldValidate: true, shouldDirty: true });
                    setPartnerDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Agreement Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg mb-4">Agreement Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="signature-date" className="text-gray-700">
                    Signature Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="signature-date"
                    type="date"
                    className="mt-1"
                    {...register('signatureDate', { required: 'Signature date is required' })}
                  />
                  {errors.signatureDate?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.signatureDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="start-date" className="text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    className="mt-1"
                    {...register('startDate', { required: 'Start date is required' })}
                  />
                  {errors.startDate?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="end-date" className="text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    className="mt-1"
                    {...register('endDate', { required: 'End date is required' })}
                  />
                  {errors.endDate?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">
                    Type of Agreement <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('agreementType') || ''}
                    onValueChange={(v) => setValue('agreementType', v, { shouldValidate: true, shouldDirty: true })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exchange-of-letters">Exchange of Letters</SelectItem>
                      <SelectItem value="donor-agreement">Donor Agreement</SelectItem>
                      <SelectItem value="cash-transfer">Cash Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('agreementType', { required: 'Type of agreement is required' })}
                  />
                  {errors.agreementType?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.agreementType.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">
                    Currency <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('currency') || ''}
                    onValueChange={(v) => setValue('currency', v, { shouldValidate: true, shouldDirty: true })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                      <SelectItem value="byn">BYN</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('currency', { required: 'Currency is required' })} />
                  {errors.currency?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="exchange-rate" className="text-gray-700">
                    Exchange Rate <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="exchange-rate"
                    type="number"
                    step="0.0001"
                    className="mt-1"
                    {...register('exchangeRate', { required: 'Exchange rate is required' })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Exchange rate date is aligned with signature date: {signatureDate || '—'}
                  </p>
                  {errors.exchangeRate?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.exchangeRate.message}</p>
                  )}
                </div>

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

                <div className="md:col-span-3">
                  <Label htmlFor="purpose-of-funding" className="text-gray-700">
                    Purpose of funding <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('purposeOfFunding') || ''}
                    onValueChange={(v) => setValue('purposeOfFunding', v, { shouldValidate: true, shouldDirty: true })}
                  >
                    <SelectTrigger id="purpose-of-funding" className="mt-1">
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {PURPOSE_OF_FUNDING_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('purposeOfFunding', { required: 'Purpose of funding is required' })}
                  />
                  {errors.purposeOfFunding?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.purposeOfFunding.message}</p>
                  )}
                </div>

                {/* <div>
                  <Label className="text-gray-700">
                    Special Purpose (SP)<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('costSharing') || ''}
                    onValueChange={(v) => setValue('costSharing', v, { shouldValidate: true, shouldDirty: true })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('costSharing', { required: 'Cost sharing is required' })} />
                  {errors.costSharing?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.costSharing.message}</p>
                  )}
                </div> */}

                <div>
                  <Label className="text-gray-700">
                    Treatment of interest <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('treatmentOfInterest') || ''}
                    onValueChange={(v) =>
                      setValue('treatmentOfInterest', v, { shouldValidate: true, shouldDirty: true })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retain">Retain</SelectItem>
                      <SelectItem value="return">Return to Donor</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('treatmentOfInterest', { required: 'Treatment of interest is required' })}
                  />
                  {errors.treatmentOfInterest?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.treatmentOfInterest.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">
                    Treatment of unspent balance <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('treatmentOfUnspentBalance') || ''}
                    onValueChange={(v) =>
                      setValue('treatmentOfUnspentBalance', v, { shouldValidate: true, shouldDirty: true })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retain">Retain</SelectItem>
                      <SelectItem value="return">Return to Donor</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('treatmentOfUnspentBalance', {
                      required: 'Treatment of unspent balance is required',
                    })}
                  />
                  {errors.treatmentOfUnspentBalance?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.treatmentOfUnspentBalance.message}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="terms" className="text-gray-700">
                    Terms and conditions <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="terms"
                    className="mt-1"
                    rows={4}
                    {...register('termsAndConditions', { required: 'Terms and conditions is required' })}
                  />
                  {errors.termsAndConditions?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.termsAndConditions.message}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="attachments" className="text-gray-700">
                    Attachments <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="attachments"
                    type="file"
                    className="mt-1"
                    multiple
                    {...register('attachments', {
                      required: 'At least one attachment is required',
                      validate: (files) =>
                        files && files.length > 0 ? true : 'At least one attachment is required',
                    })}
                  />
                  {errors.attachments?.message && (
                    <p className="text-xs text-red-500 mt-1">{String(errors.attachments.message)}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="comments" className="text-gray-700">
                    Comments (if any)
                  </Label>
                  <Textarea id="comments" className="mt-1" rows={4} {...register('comments')} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => navigate('/agreements')}>
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
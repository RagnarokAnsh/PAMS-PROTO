import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, X, Plus } from 'lucide-react';

type PartnerRecord = {
  sno: number;
  name: string;
  bpNumber: string;
  type: string;
  subType: string;
  origin: string;
  parent: string;
};

const STORAGE_KEY = 'pams_partners';

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

const defaultPartners: PartnerRecord[] = [
  {
    sno: 1,
    name: '1QB INFORMATION TECHNOLOGIES INC',
    bpNumber: '90000',
    type: 'Member States and the EU',
    subType: '',
    origin: 'India',
    parent: '1QB INFORMATION TECHNOLOGIES INC',
  },
  {
    sno: 2,
    name: '1QB INFORMATION TECHNOLOGIES INC',
    bpNumber: '11212121221',
    type: 'Private Sector',
    subType: 'Academia',
    origin: 'Global',
    parent: '1QB INFORMATION TECHNOLOGIES INC',
  },
  {
    sno: 3,
    name: 'Abu Dhabi Police',
    bpNumber: '1300004331',
    type: 'Member States and the EU',
    subType: '',
    origin: 'United Arab Emirates',
    parent: 'United Arab Emirates',
  },
  {
    sno: 4,
    name: 'Acción Social',
    bpNumber: '11222',
    type: 'Private Sector',
    subType: 'Academia',
    origin: 'Global',
    parent: '1QB INFORMATION TECHNOLOGIES INC',
  },
  {
    sno: 5,
    name: 'Administrative Control and Transparency Authority',
    bpNumber: '1300008659',
    type: 'Member States and the EU',
    subType: '',
    origin: 'Qatar',
    parent: 'Qatar',
  },
];

export function Partners() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const partners = useMemo(() => {
    const stored = safeReadPartnersFromStorage();
    const merged = [...defaultPartners, ...stored];
    return merged.sort((a, b) => (a.sno || 0) - (b.sno || 0));
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="By Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member-states">Member States and the EU</SelectItem>
              <SelectItem value="private-sector">Private Sector</SelectItem>
              <SelectItem value="un-agencies">UN Agencies</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="By Origin/Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="uae">United Arab Emirates</SelectItem>
              <SelectItem value="qatar">Qatar</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
            onClick={() => navigate('/partners/create')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Partner
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>Partner Name</TableHead>
              <TableHead>BP Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sub-Type</TableHead>
              <TableHead>Origin/Country</TableHead>
              <TableHead>Parent Partner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.sno}>
                <TableCell>{partner.sno}</TableCell>
                <TableCell className="text-primary">{partner.name}</TableCell>
                <TableCell>{partner.bpNumber}</TableCell>
                <TableCell>{partner.type}</TableCell>
                <TableCell>{partner.subType}</TableCell>
                <TableCell>{partner.origin}</TableCell>
                <TableCell>{partner.parent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600 mr-4">
            Showing 1 to 20 of 469 entries
          </span>
          <Button variant="outline" size="sm" disabled>
            «
          </Button>
          <Button variant="outline" size="sm" disabled>
            ‹
          </Button>
          <Button className="bg-green-100 text-green-700" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
          <Button variant="outline" size="sm">
            ›
          </Button>
          <Button variant="outline" size="sm">
            »
          </Button>
          <Select defaultValue="20">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

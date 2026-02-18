import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, Filter, FileDown, Plus, ChevronDown } from 'lucide-react';

import { useMockData } from '../context/MockDataContext';

// Removed local agreements array
// Removed STATUS_COLORS constant as it might be better placed or we can keep it if component specific

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  'SUBMITTED FOR REVIEW': 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function Agreements() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { agreements } = useMockData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <span className="mr-2">Group By</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link to="/dashboard/agreements/create">
            <Button className="bg-primary hover:bg-primary/80" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Agreement
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Agreement ID</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Amount In USD</TableHead>
              <TableHead>Grant Total($)</TableHead>
              <TableHead>Top-up($)</TableHead>
              <TableHead>Balance($)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agreements.map((agreement) => (
              <TableRow
                key={agreement.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/dashboard/agreements/${agreement.id}`)}
              >
                <TableCell>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </TableCell>
                <TableCell className="text-primary font-medium">
                  {agreement.id}
                </TableCell>
                <TableCell>{agreement.partner}</TableCell>
                <TableCell>{agreement.type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[agreement.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {agreement.status}
                  </span>
                </TableCell>
                <TableCell>{agreement.amount}</TableCell>
                <TableCell>{agreement.amountUSD}</TableCell>
                <TableCell>{agreement.grantTotal}</TableCell>
                <TableCell>{agreement.topUp}</TableCell>
                <TableCell>{agreement.balance}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            «
          </Button>
          <Button variant="outline" size="sm" disabled>
            ‹
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            ›
          </Button>
          <Button variant="outline" size="sm">
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
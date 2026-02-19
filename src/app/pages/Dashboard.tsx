import { useState } from 'react';
import { Link } from 'react-router';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ChevronDown, Search, Filter, FileDown, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const agreementData = [
  { name: 'Completed', value: 1167, color: 'var(--primary)' },
  { name: 'Cancelled', value: 1, color: '#ef4444' },
];

const grantData = [
  { name: 'Approved', value: 11, color: 'var(--primary)' },
  { name: 'Cancelled', value: 4, color: '#ef4444' },
  { name: 'Draft', value: 9, color: '#6b7280' },
  { name: 'Send Back', value: 6, color: '#f59e0b' },
  { name: 'Submitted', value: 1904, color: '#10b981' },
];

const amendmentData = [
  { name: 'Draft', value: 1, color: '#6b7280' },
  { name: 'Submitted for Approval', value: 281, color: '#10b981' },
  { name: 'Submitted for Review', value: 2, color: 'var(--primary)' },
];

const agreements = [
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
  {
    id: 'AU26007',
    partner: 'Australia Federal Police',
    type: 'Exchange of Letters',
    status: 'COMPLETED',
    amount: '44243.00 ALL',
    amountUSD: '537.13',
    grantTotal: '0.00',
    topUp: '0.00',
    balance: '537.13',
  },
  {
    id: 'XX26006',
    partner: 'African Development Bank Group - AfDB',
    type: 'Cash Transfer',
    status: 'COMPLETED',
    amount: '1000.00 USD',
    amountUSD: '1000.00',
    grantTotal: '500.00',
    topUp: '0.00',
    balance: '500.00',
  },
  {
    id: 'XX26005',
    partner: 'African Development Bank Group - AfDB',
    type: 'Cash Transfer',
    status: 'COMPLETED',
    amount: '15600.00 USD',
    amountUSD: '15600.00',
    grantTotal: '15000.00',
    topUp: '0.00',
    balance: '600.00',
  },
];

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-gray-700">
          Hello, <span className="font-semibold">Ansh Sharma</span>!
        </p>
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agreement Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg mb-4">Agreement Overview</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={agreementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {agreementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-gray-600">CANCELLED</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
              <span className="text-gray-600">COMPLETED</span>
            </div>
          </div>
        </div>

        {/* Grant Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg mb-4">Grant Overview</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={grantData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {grantData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
              <span className="text-gray-600">APPROVED</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-gray-600">CANCELLED</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
              <span className="text-gray-600">DRAFT</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-gray-600">SEND BACK FOR CHANGES</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-600">SUBMITTED FOR APPROVAL</span>
            </div>
          </div>
        </div>

        {/* Amendment Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg mb-4">Amendment Overview</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={amendmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {amendmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
              <span className="text-gray-600">DRAFT</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-600">SUBMITTED FOR APPROVAL</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
              <span className="text-gray-600">SUBMITTED FOR REVIEW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agreements Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl mb-4">Agreements</h2>
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
              <Link to="/agreements/create">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agreement
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
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
                <TableRow key={agreement.id}>
                  <TableCell>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </TableCell>
                  <TableCell className="text-primary">{agreement.id}</TableCell>
                  <TableCell>{agreement.partner}</TableCell>
                  <TableCell>{agreement.type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${agreement.status === 'COMPLETED'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {agreement.status}
                    </span>
                  </TableCell>
                  <TableCell>{agreement.amount}</TableCell>
                  <TableCell>{agreement.amountUSD}</TableCell>
                  <TableCell>{agreement.grantTotal}</TableCell>
                  <TableCell>{agreement.topUp}</TableCell>
                  <TableCell>{agreement.balance}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing 1 to 10 of 1168</span>
          <div className="flex items-center space-x-2">
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
            <Select defaultValue="10">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="text-right">
        <span className="text-lg">
          <strong>Total:</strong> $1,562,947,298.84
        </span>
      </div>
    </div>
  );
}
import { useState } from 'react';
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
import { Search, ChevronRight } from 'lucide-react';

const auditLogs = [
  {
    sno: 1,
    entity: 'Grant',
    idNumber: 'ffff',
    user: 'test.user@example.com',
    action: 'STATUS CHANGE',
    time: 'Feb 12, 2026, 8:51:58 AM',
  },
  {
    sno: 2,
    entity: 'Grant',
    idNumber: 'ffff',
    user: 'test.user@example.com',
    action: 'STATUS CHANGE',
    time: 'Feb 12, 2026, 8:51:51 AM',
  },
  {
    sno: 3,
    entity: 'Agreement',
    idNumber: 'XX26009',
    user: 'test.user@example.com',
    action: 'STATUS CHANGE',
    time: 'Feb 12, 2026, 8:50:59 AM',
  },
  {
    sno: 4,
    entity: 'Agreement',
    idNumber: 'XX26009',
    user: 'test.user@example.com',
    action: 'STATUS CHANGE',
    time: 'Feb 12, 2026, 8:50:29 AM',
  },
  {
    sno: 5,
    entity: 'Agreement',
    idNumber: 'XX26009',
    user: 'test.user@example.com',
    action: 'CREATE_AGREEMENT',
    time: 'Feb 12, 2026, 8:50:13 AM',
  },
  {
    sno: 6,
    entity: 'Amendment',
    idNumber: '1',
    user: 'test.user2@example.com',
    action: 'STATUS CHANGE',
    time: 'Jan 28, 2026, 1:21:08 PM',
  },
  {
    sno: 7,
    entity: 'Amendment',
    idNumber: '319',
    user: 'test.user2@example.com',
    action: 'STATUS CHANGE',
    time: 'Jan 27, 2026, 5:21:48 PM',
  },
];

export function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Search */}
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>S.No.</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Id/Number</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.sno}>
                <TableCell>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </TableCell>
                <TableCell>{log.sno}</TableCell>
                <TableCell className="text-primary">{log.entity}</TableCell>
                <TableCell className="text-primary">{log.idNumber}</TableCell>
                <TableCell className="text-primary">{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="text-primary">{log.time}</TableCell>
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
  );
}
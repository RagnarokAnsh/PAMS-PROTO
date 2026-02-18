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
import { Search, Edit, Trash2, Plus } from 'lucide-react';

const users = [
  {
    sno: 1,
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin.test@example.com',
    group: '',
    status: false,
  },
  {
    sno: 2,
    firstName: 'Test',
    lastName: 'User 1',
    email: 'test.user1@example.com',
    group: '',
    status: false,
  },
  {
    sno: 3,
    firstName: 'Test',
    lastName: 'User 2',
    email: 'test.user2@example.com',
    group: '',
    status: false,
  },
  {
    sno: 4,
    firstName: 'Test',
    lastName: 'User 3',
    email: 'test.user3@example.com',
    group: '',
    status: false,
  },
  {
    sno: 5,
    firstName: 'Test',
    lastName: 'User 4',
    email: 'test.user4@example.com',
    group: '',
    status: false,
  },
];

export function Users() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Search and Create */}
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

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.sno}>
                <TableCell>{user.sno}</TableCell>
                <TableCell className="text-primary">{user.firstName}</TableCell>
                <TableCell className="text-primary">{user.lastName}</TableCell>
                <TableCell className="text-primary">{user.email}</TableCell>
                <TableCell>{user.group}</TableCell>
                <TableCell>
                  <div className="w-8 h-4 bg-gray-300 rounded-full"></div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600 mr-4">
            Showing 1 to 10 of 4769 users
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
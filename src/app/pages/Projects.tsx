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
import { Search, Edit, Plus } from 'lucide-react';

const projects = [
  {
    sno: 1,
    code: 'TEst',
    title: 'TEsting',
  },
  {
    sno: 2,
    code: 'ZAFT54',
    title: 'Strengthening Law Enforcement Capacity (Border Control Operations) and Criminal Justice Response to',
  },
  {
    sno: 3,
    code: 'ZAFS56',
    title: "Establishment of a One-Stop Centre to Counteract Violence against Women and Children (Mitchell's Pla",
  },
  {
    sno: 4,
    code: 'ZAFS15',
    title: 'Establishment of One-stop Centers to counteract Violence against Women',
  },
  {
    sno: 5,
    code: 'ZAFJ06',
    title: 'Drug demand reduction and related HIV prevention project for Western Cape Province',
  },
  {
    sno: 6,
    code: 'YEMX24',
    title: 'Yemen: Strengthening criminal justice responses to terrorism',
  },
  {
    sno: 7,
    code: 'XWWK05',
    title: 'Sub regional project for the provision of comprehensive HIV prevention and care services to Afghan r',
  },
  {
    sno: 8,
    code: 'XWSV33',
    title: 'Support to Transnational Crime Units under the West Africa Coast Initiative',
  },
  {
    sno: 9,
    code: 'XWAK38',
    title: 'Preparatory Assistance for the Regional Programme for Afghanistan and neighbouring countries.',
  },
  {
    sno: 10,
    code: 'XSSX11',
    title: 'Trust Fund Expedited Facility',
  },
];

export function Projects() {
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
          Create Project
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.sno}>
                <TableCell className="text-primary">{project.sno}</TableCell>
                <TableCell className="text-primary">{project.code}</TableCell>
                <TableCell className="text-primary">{project.title}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600 mr-4">
            Showing 1 to 10 of 521
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

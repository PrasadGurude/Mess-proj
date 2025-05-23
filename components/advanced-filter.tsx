"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Filter, Plus, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Filter as FilterType, FilterCriteria } from "@/lib/types"

interface AdvancedFilterProps {
  onApplyFilter: (filter: FilterType) => void
}

export function AdvancedFilter({ onApplyFilter }: AdvancedFilterProps) {
  const [filterName, setFilterName] = useState("")
  const [criteria, setCriteria] = useState<FilterCriteria[]>([{ field: "name", operator: "contains", value: "" }])

  const addCriteria = () => {
    setCriteria([...criteria, { field: "name", operator: "contains", value: "" }])
  }

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index))
  }

  const updateCriteria = (index: number, field: keyof FilterCriteria, value: string | number | boolean) => {
    const newCriteria = [...criteria]
    newCriteria[index] = { ...newCriteria[index], [field]: value }
    setCriteria(newCriteria)
  }

  const handleApplyFilter = () => {
    const filter: FilterType = {
      id: `filter-${Date.now()}`,
      name: filterName || "Unnamed Filter",
      criteria,
    }
    onApplyFilter(filter)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Advanced Filter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="filter-name">Filter Name</Label>
            <Input
              id="filter-name"
              placeholder="My Custom Filter"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Filter Criteria</Label>

            {criteria.map((criterion, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Select value={criterion.field} onValueChange={(value) => updateCriteria(index, "field", value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                    <SelectItem value="label">Label</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={criterion.operator} onValueChange={(value) => updateCriteria(index, "operator", value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="starts_with">Starts with</SelectItem>
                    <SelectItem value="ends_with">Ends with</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={criterion.value as string}
                  onChange={(e) => updateCriteria(index, "value", e.target.value)}
                  className="flex-1"
                />

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCriteria(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" className="mt-2" onClick={addCriteria}>
              <Plus className="h-3 w-3 mr-1" />
              Add Criteria
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Badge variant="outline" className="px-2 py-1">
              {criteria.length} criteria
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm" onClick={handleApplyFilter}>
              <Save className="h-3 w-3 mr-1" />
              Apply Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

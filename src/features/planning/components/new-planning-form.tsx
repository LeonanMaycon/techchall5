import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'

interface PlanningFormData {
  discipline: string
  grade: string
  theme: string
  totalDays: number
  duration: number
  weeklyObjective: string
  classLevel: string
  notes: string
  prompt: string
}

interface Props {
  title: string
  form: PlanningFormData
  setForm: React.Dispatch<React.SetStateAction<PlanningFormData>>
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  submitLabel: string
}

export function NewPlanningFormLayout({
  title,
  form,
  setForm,
  loading,
  onSubmit,
  submitLabel,
}: Props) {
  const navigate = useNavigate()

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-8">

          {/* Informações básicas */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Informações básicas</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Input
                  value={form.discipline}
                  onChange={(e) =>
                    setForm({ ...form, discipline: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Série/Ano</Label>
                <Input
                  value={form.grade}
                  onChange={(e) =>
                    setForm({ ...form, grade: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Tema principal</Label>
                <Input
                  value={form.theme}
                  onChange={(e) =>
                    setForm({ ...form, theme: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Dias na semana</Label>
                <Input
                  type="number"
                  value={form.totalDays}
                  onChange={(e) =>
                    setForm({ ...form, totalDays: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Objetivo */}
          <div className="space-y-2">
            <Label>Objetivo geral da semana</Label>
            <Textarea
              rows={3}
              value={form.weeklyObjective}
              onChange={(e) =>
                setForm({ ...form, weeklyObjective: e.target.value })
              }
            />
          </div>

          {/* Perfil */}
          <div className="space-y-2">
            <Label>Nível da turma</Label>

            <Select
              value={form.classLevel}
              onValueChange={(value) =>
                setForm({ ...form, classLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observações adicionais</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </div>

          <Separator />

          {/* Prompt */}
          <div className="space-y-2">
            <Label>
              Descreva o que você deseja que o planejamento contemple
            </Label>
            <Textarea
              rows={4}
              value={form.prompt}
              onChange={(e) =>
                setForm({ ...form, prompt: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => navigate({ to: '/plannings' })}
              variant="outline"
              className="w-full max-w-30"
            >
              <ArrowLeft />
              Voltar
            </Button>

            <Button
              type="submit"
              className="w-full max-w-60"
              disabled={loading}
            >
              <Save />
              {loading ? 'Salvando...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

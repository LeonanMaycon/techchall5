import type { PlanningRow } from '../planning.types'

interface AIGenerationPayload {
  discipline: string
  grade: string
  theme: string
  totalDays: number
  duration: number
  weeklyObjective: string
  classLevel: string
  notes?: string
  prompt: string
}

const API_KEY = import.meta.env.VITE_GROQ_API_KEY
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Using Groq's Llama model
const MODEL = 'llama-3.3-70b-versatile'

const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
]

function buildPrompt(payload: AIGenerationPayload): string {
  const days = weekDays.slice(0, payload.totalDays)
  
  return `Você é um especialista em educação. Crie um plano de aula semanal com base nas seguintes informações:

Disciplina: ${payload.discipline}
Série/Ano: ${payload.grade}
Tema: ${payload.theme}
Nível da turma: ${payload.classLevel}
Duração das aulas: ${payload.duration} minutos
Objetivo geral: ${payload.weeklyObjective}
${payload.notes ? `Observações adicionais: ${payload.notes}` : ''}

Requisito do usuário: ${payload.prompt}

Gere um plano para os seguintes dias: ${days.join(', ')}

Retorne APENAS um objeto JSON (sem markdown, sem explicações adicionais) com a seguinte estrutura:
{
  "rows": [
    {
      "day": "Segunda-feira",
      "objective": "objetivo da aula",
      "content": "conteúdo a ser ensinado",
      "methodology": "metodologia/estratégia de ensino",
      "activity": "atividade/exercício"
    }
  ]
}

Certifique-se de que:
- Cada linha tem exatamente um dia
- O número de dias corresponde aos dias informados
- Os objetivos, conteúdos, metodologias e atividades são específicos e práticos
- A resposta é um JSON válido`
}

export async function generatePlanningWithAI(
  payload: AIGenerationPayload
): Promise<PlanningRow[]> {
  if (!API_KEY) {
    throw new Error(
      'Chave API do Groq não configurada. Configure a variável de ambiente VITE_GROQ_API_KEY'
    )
  }

  const prompt = buildPrompt(payload)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Erro da API Groq:', {
        status: response.status,
        statusText: response.statusText,
        error,
      })
      throw new Error(
        `Erro ${response.status}: ${error.error?.message || response.statusText || 'Erro desconhecido'}`
      )
    }

    const data = await response.json()

    // Extract the text content from the OpenAI-compatible response
    const textContent = data.choices?.[0]?.message?.content

    if (!textContent) {
      throw new Error('Resposta vazia da API')
    }

    // Parse the JSON response (removing markdown code blocks if present)
    let jsonText = textContent.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }

    const parsedResponse = JSON.parse(jsonText)

    // Validate the response structure
    if (!Array.isArray(parsedResponse.rows)) {
      throw new Error('Resposta da API não contém um array de linhas válido')
    }

    // Validate each row has required fields
    const validatedRows = parsedResponse.rows.map(
      (row: Record<string, unknown>) => ({
        day: String(row.day || ''),
        objective: String(row.objective || ''),
        content: String(row.content || ''),
        methodology: String(row.methodology || ''),
        activity: String(row.activity || ''),
      })
    )

    return validatedRows
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Erro ao processar resposta da API: ${error.message}`)
    }
    throw error
  }
}

import { Ban, CalendarClock, Droplet, Hand, ShieldCheck, Sun } from 'lucide-react';
import { PageHead } from '../../ui';

const STEPS = [
  { icon: Droplet, title: 'Lavagem', text: 'Lave o cabelo com shampoo adequado ao seu tipo de fio, sem água muito quente, que resseca o couro cabeludo.' },
  { icon: Hand, title: 'Barba hidratada', text: 'Use óleo ou balm de barba todos os dias, de preferência depois do banho, para amaciar os fios e evitar coceira.' },
  { icon: Ban, title: 'Evite irritação', text: 'Depois da navalha, não passe produtos com álcool. Se surgirem bolinhas, não esprema: use um pós-barba calmante.' },
  { icon: Sun, title: 'Sol e piscina', text: 'Cloro e sol desbotam luzes e platinado. Use protetor capilar e lave o cabelo logo depois da piscina ou do mar.' },
  { icon: CalendarClock, title: 'Manutenção', text: 'Para manter o degradê alinhado, volte a cada 2 ou 3 semanas. O pezinho pode ser feito entre um corte e outro.' },
  { icon: ShieldCheck, title: 'Quando procurar a barbearia', text: 'Irritação que não passa em 2 dias ou alergia a algum produto: fale com a gente e, se precisar, procure um dermatologista.' },
];

export default function Aftercare() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHead back="/perfil" title="Cuidados com barba e cabelo" subtitle="Dicas para o corte e a barba durarem mais." />
      <ol className="flex flex-col gap-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="card flex gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint2 text-accent2">
              <s.icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold">
                {i + 1}. {s.title}
              </p>
              <p className="mt-1 text-soft">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

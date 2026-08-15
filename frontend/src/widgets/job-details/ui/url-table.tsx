import { ExternalLink, AlertCircle, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { JobItem, JobItemStatus } from '../../../entities/job';
import { cn } from '../../../shared/lib/utils';
import { CopyButton } from '../../../shared/ui';

interface UrlTableProps {
  items: JobItem[];
  emptyMessage?: string;
}

function getHttpCodeBadgeClass(code?: number) {
  if (!code) return 'bg-[#262626] text-[#5e5d59] border-[#323232]';
  if (code >= 200 && code < 300) return 'bg-[#112a1d] text-[#4ade80] border-[#1d4d33]';
  if (code >= 300 && code < 400) return 'bg-[#0c2838] text-[#38bdf8] border-[#164e63]';
  if (code >= 400 && code < 500) return 'bg-[#2b2210] text-[#fbbf24] border-[#5e4414]';
  return 'bg-[#2b1416] text-[#f87171] border-[#5c1d24]';
}

function getItemStatusIcon(status: JobItemStatus) {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-3.5 w-3.5 text-[#4ade80]" />;
    case 'error':
      return <XCircle className="h-3.5 w-3.5 text-[#f87171]" />;
    case 'in_progress':
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2b7fff]" />;
    case 'cancelled':
      return <AlertCircle className="h-3.5 w-3.5 text-[#5e5d59]" />;
    case 'pending':
    default:
      return <Clock className="h-3.5 w-3.5 text-[#a4a19b]" />;
  }
}

const ITEM_STATUS_LABELS: Record<JobItemStatus, string> = {
  pending: 'Ожидает',
  in_progress: 'Проверка...',
  success: 'Успешно',
  error: 'Ошибка',
  cancelled: 'Отменено',
};

export function UrlTable({
  items,
  emptyMessage = 'Нет ссылок с выбранным статусом',
}: UrlTableProps) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-[#262626] bg-[#111111] shadow-inner">
      <div className="max-h-[460px] scrollbar-thin scrollbar-thumb-[#262626] overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans text-[12px]">
          <thead className="sticky top-0 z-10 border-b border-[#262626] bg-[#1a1a1a] font-mono text-[11px] tracking-wider text-[#a4a19b] uppercase">
            <tr>
              <th className="w-10 px-3 py-2.5 text-center">#</th>
              <th className="w-28 px-3 py-2.5">Статус</th>
              <th className="px-3 py-2.5">URL</th>
              <th className="w-24 px-3 py-2.5">HTTP Код</th>
              <th className="w-24 px-3 py-2.5 text-right">Время</th>
              <th className="w-36 px-3 py-2.5">Ошибка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f1f]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center font-mono text-[12px] text-[#5e5d59]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={`${item.url}-${index}`}
                  className="group transition-colors hover:bg-[#1a1a1a]/80"
                >
                  <td className="px-3 py-2.5 text-center font-mono text-[11px] text-[#5e5d59]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getItemStatusIcon(item.status)}
                      <span className="text-[12px] text-[#eeeeee]">
                        {ITEM_STATUS_LABELS[item.status]}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-[280px] px-3 py-2.5 font-mono text-[12px] text-[#eeeeee]">
                    <div className="flex items-center justify-between gap-1.5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 truncate transition-colors hover:text-[#2b7fff] hover:underline"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 text-[#5e5d59] group-hover:text-[#2b7fff]" />
                      </a>
                      <CopyButton
                        text={item.url}
                        label=""
                        showTooltip={true}
                        iconClassName="w-3 h-3"
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {item.httpCode ? (
                      <span
                        className={cn(
                          'rounded-[3px] border px-1.5 py-0.5 font-mono text-[11px] font-semibold',
                          getHttpCodeBadgeClass(item.httpCode),
                        )}
                      >
                        {item.httpCode}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-[#5e5d59]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[11px] whitespace-nowrap text-[#a4a19b]">
                    {item.duration !== undefined ? `${item.duration} мс` : '—'}
                  </td>
                  <td
                    className="max-w-[160px] truncate px-3 py-2.5 font-mono text-[11px] text-[#f87171]"
                    title={item.errorMessage || ''}
                  >
                    {item.errorMessage || <span className="text-[#5e5d59]">—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { ExternalLink, AlertCircle, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { JobItem, JobItemStatus } from '../../../entities/job';
import { cn } from '../../../shared/lib/utils';

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
      return <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />;
    case 'error':
      return <XCircle className="w-3.5 h-3.5 text-[#f87171]" />;
    case 'in_progress':
      return <Loader2 className="w-3.5 h-3.5 text-[#2b7fff] animate-spin" />;
    case 'cancelled':
      return <AlertCircle className="w-3.5 h-3.5 text-[#5e5d59]" />;
    case 'pending':
    default:
      return <Clock className="w-3.5 h-3.5 text-[#a4a19b]" />;
  }
}

const ITEM_STATUS_LABELS: Record<JobItemStatus, string> = {
  pending: 'Ожидает',
  in_progress: 'Проверка...',
  success: 'Успешно',
  error: 'Ошибка',
  cancelled: 'Отменено',
};

export function UrlTable({ items, emptyMessage = 'Нет ссылок с выбранным статусом' }: UrlTableProps) {
  return (
    <div className="border border-[#262626] rounded-[6px] overflow-hidden bg-[#111111]">
      <div className="overflow-x-auto max-h-[460px]">
        <table className="w-full text-left text-[12px] border-collapse font-sans">
          <thead className="bg-[#1a1a1a] border-b border-[#262626] sticky top-0 z-10 text-[11px] text-[#a4a19b] uppercase tracking-wider font-mono">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3 w-28">Статус</th>
              <th className="py-2.5 px-3">URL</th>
              <th className="py-2.5 px-3 w-24">HTTP Код</th>
              <th className="py-2.5 px-3 w-24 text-right">Время</th>
              <th className="py-2.5 px-3 w-36">Ошибка</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f1f]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#5e5d59] font-mono text-[12px]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={`${item.url}-${index}`}
                  className="hover:bg-[#1a1a1a]/60 transition-colors group"
                >
                  {/* Index */}
                  <td className="py-2.5 px-3 text-center text-[#5e5d59] font-mono text-[11px]">
                    {index + 1}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getItemStatusIcon(item.status)}
                      <span className="text-[12px] text-[#eeeeee]">
                        {ITEM_STATUS_LABELS[item.status]}
                      </span>
                    </div>
                  </td>

                  {/* URL */}
                  <td className="py-2.5 px-3 font-mono text-[12px] text-[#eeeeee] break-all max-w-[280px]">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 hover:text-[#2b7fff] hover:underline transition-colors"
                    >
                      <span>{item.url}</span>
                      <ExternalLink className="w-3 h-3 text-[#5e5d59] group-hover:text-[#2b7fff] shrink-0" />
                    </a>
                  </td>

                  {/* HTTP Code */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {item.httpCode ? (
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-[3px] font-mono text-[11px] font-semibold border',
                          getHttpCodeBadgeClass(item.httpCode)
                        )}
                      >
                        {item.httpCode}
                      </span>
                    ) : (
                      <span className="text-[#5e5d59] font-mono text-[11px]">—</span>
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-2.5 px-3 text-right font-mono text-[11px] text-[#a4a19b] whitespace-nowrap">
                    {item.duration !== undefined ? `${item.duration} мс` : '—'}
                  </td>

                  {/* Error message */}
                  <td
                    className="py-2.5 px-3 text-[11px] font-mono text-[#f87171] truncate max-w-[160px]"
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

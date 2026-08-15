import { useState, useMemo, KeyboardEvent } from 'react';
import { PlusCircle, Sparkles, Send, Loader2 } from 'lucide-react';
import { useJobStore } from '../../../entities/job';
import { Button } from '../../../shared/ui';

const TEST_URLS_PRESET = [
  'https://google.com',
  'https://github.com',
  'https://yandex.ru',
  'https://cloudflare.com',
  'https://en.wikipedia.org',
  'http://nonexistent-domain-404-check.xyz',
  'https://httpbin.org/delay/2',
].join('\n');

function parseUrls(rawText: string): string[] {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (line) => line.length > 0 && (line.startsWith('http://') || line.startsWith('https://')),
    );
}

export function CreateJobForm() {
  const [inputText, setInputText] = useState('');
  const { createJob, isSubmittingJob } = useJobStore();

  const parsedUrls = useMemo(() => parseUrls(inputText), [inputText]);
  const rawLinesCount = useMemo(
    () => inputText.split('\n').filter((l) => l.trim().length > 0).length,
    [inputText],
  );
  const invalidCount = Math.max(0, rawLinesCount - parsedUrls.length);

  const handleSubmit = async () => {
    if (parsedUrls.length === 0 || isSubmittingJob) return;

    try {
      await createJob(parsedUrls);
      setInputText('');
    } catch (_err) {
      void _err;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInsertPreset = () => {
    setInputText(TEST_URLS_PRESET);
  };

  return (
    <div className="rounded-[8px] border border-[#262626] bg-[#1f1f1f] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[#262626] pb-3">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-[#2b7fff]" />
          <h2 className="font-serif text-[16px] text-[#eeeeee]">Новая проверка</h2>
        </div>
        <button
          type="button"
          onClick={handleInsertPreset}
          disabled={isSubmittingJob}
          className="flex cursor-pointer items-center gap-1.5 font-sans text-[12px] text-[#2b7fff] transition-colors hover:text-[#5499ff] focus:outline-none disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Тестовые URL</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmittingJob}
            placeholder={'https://example.com\nhttps://site.org\nhttp://broken-url.xyz'}
            rows={5}
            className="min-h-[110px] w-full resize-y rounded-[4px] border border-[#262626] bg-[#111111] px-3 py-2.5 font-mono text-[12px] leading-relaxed text-[#eeeeee] placeholder-[#5e5d59] transition-colors focus:border-[#2b7fff] focus:outline-none disabled:opacity-60"
          />
        </div>

        <div className="flex items-center justify-between font-sans text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className={
                parsedUrls.length > 0 ? 'font-mono font-medium text-[#4ade80]' : 'text-[#a4a19b]'
              }
            >
              Валидных URL: {parsedUrls.length}
            </span>
            {invalidCount > 0 && (
              <span className="font-mono text-[#fbbf24]">
                (пропущено невалидных: {invalidCount})
              </span>
            )}
          </div>
          <span className="hidden text-[#5e5d59] sm:inline">Ctrl+Enter для запуска</span>
        </div>

        <Button
          variant="accent"
          onClick={handleSubmit}
          disabled={parsedUrls.length === 0 || isSubmittingJob}
          className="h-9 w-full justify-center gap-2 text-[13px] font-medium"
        >
          {isSubmittingJob ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#eeeeee]" />
              <span>Создание задания...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              <span>Запустить проверку ({parsedUrls.length})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

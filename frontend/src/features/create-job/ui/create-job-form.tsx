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

/**
 * Normalizes multiline raw input into a cleaned array of valid URLs.
 */
function parseUrls(rawText: string): string[] {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && (line.startsWith('http://') || line.startsWith('https://')));
}

export function CreateJobForm() {
  const [inputText, setInputText] = useState('');
  const { createJob, isSubmittingJob } = useJobStore();

  const parsedUrls = useMemo(() => parseUrls(inputText), [inputText]);
  const rawLinesCount = useMemo(
    () => inputText.split('\n').filter((l) => l.trim().length > 0).length,
    [inputText]
  );
  const invalidCount = Math.max(0, rawLinesCount - parsedUrls.length);

  const handleSubmit = async () => {
    if (parsedUrls.length === 0 || isSubmittingJob) return;

    try {
      await createJob(parsedUrls);
      setInputText('');
    } catch {
      // Error handled by store toast notifications
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
    <div className="bg-[#1f1f1f] border border-[#262626] rounded-[8px] p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-[#2b7fff]" />
          <h2 className="font-serif text-[16px] text-[#eeeeee]">Новая проверка</h2>
        </div>
        <button
          type="button"
          onClick={handleInsertPreset}
          disabled={isSubmittingJob}
          className="flex items-center gap-1.5 text-[12px] text-[#2b7fff] hover:text-[#5499ff] transition-colors font-sans focus:outline-none cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Тестовые URL</span>
        </button>
      </div>

      {/* Input Form */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmittingJob}
            placeholder={'https://example.com\nhttps://site.org\nhttp://broken-url.xyz'}
            rows={5}
            className="w-full bg-[#111111] border border-[#262626] rounded-[4px] px-3 py-2.5 text-[12px] font-mono text-[#eeeeee] placeholder-[#5e5d59] focus:border-[#2b7fff] focus:outline-none resize-y min-h-[110px] transition-colors leading-relaxed disabled:opacity-60"
          />
        </div>

        {/* Counter and Helpers */}
        <div className="flex items-center justify-between text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <span
              className={
                parsedUrls.length > 0
                  ? 'text-[#4ade80] font-medium font-mono'
                  : 'text-[#a4a19b]'
              }
            >
              Валидных URL: {parsedUrls.length}
            </span>
            {invalidCount > 0 && (
              <span className="text-[#fbbf24] font-mono">
                (пропущено невалидных: {invalidCount})
              </span>
            )}
          </div>
          <span className="text-[#5e5d59] hidden sm:inline">
            Ctrl+Enter для запуска
          </span>
        </div>

        {/* Submit Button */}
        <Button
          variant="accent"
          onClick={handleSubmit}
          disabled={parsedUrls.length === 0 || isSubmittingJob}
          className="w-full justify-center gap-2 h-9 text-[13px] font-medium"
        >
          {isSubmittingJob ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#eeeeee]" />
              <span>Создание задания...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Запустить проверку ({parsedUrls.length})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

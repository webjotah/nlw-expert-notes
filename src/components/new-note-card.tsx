import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  let speechRecognition: SpeechRecognition | null = null;

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === '') return toast.error('A nota não pode estar vazia!');

    onNoteCreated(content);
    setContent('');
    setShouldShowOnboarding(true);

    toast.success('Nota salva com sucesso!');
  }

  function handleStartRecording() {
    const isRecordingSupported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isRecordingSupported) {
      return toast.error(
        'Seu navegador não suporta a API de gravação de áudio!'
      );
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');
      setContent(transcript);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        onClick={() => (setShouldShowOnboarding(true), setContent(''))}
        className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left outline-none hover:ring-2 ring-slate-600 focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 overflow-hidden md:-translate-x-2/4 md:-translate-y-2/4 md:h-[60vh] md:max-w-[640px] w-full bg-slate-700 flex flex-col outline-none md:rounded-md">
          <Dialog.Close className=" absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex">
                {!shouldShowOnboarding ? (
                  <button
                    className="flex items-center text-sm font-medium text-slate-200 group hover:text-orange-400 transition-all"
                    onClick={() => (
                      setShouldShowOnboarding(true), setContent('')
                    )}
                  >
                    <ArrowLeft className="size-5 mr-2" />
                  </button>
                ) : (
                  <></>
                )}
                <span className="text-sm font-medium text-slate-200">
                  Adicionar nota
                </span>
              </div>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-orange-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
                    className="font-medium text-orange-400 hover:underline"
                    onClick={() => setShouldShowOnboarding(false)}
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={(event) => setContent(event.target.value)}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full bg-slate-900 flex items-center justify-center gap-2 py-4 text-center text-sm text-slate-300 font-medium outline-none group hover:text-slate-100 transition-all"
              >
                <div className="rounded-full size-3 bg-red-500 animate-pulse" />
                Gravando (clique para interromper)
              </button>
            ) : (
              <button
                disabled={shouldShowOnboarding ? true : false}
                onClick={handleSaveNote}
                type="button"
                className="w-full bg-orange-500 py-4 text-center text-sm text-slate-200 font-medium outline-none group hover:bg-orange-600 transition-all"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

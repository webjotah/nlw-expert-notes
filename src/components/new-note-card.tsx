import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export function NewNoteCard() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('');

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    toast.success('Nota salva com sucesso!');
    console.log(content);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left outline-none hover:ring-2 ring-slate-600 focus-visible:ring-2 focus-visible:ring-orange-500">
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
        <Dialog.Content className="fixed left-1/2 top-1/2 overflow-hidden -translate-x-2/4 -translate-y-2/4 h-[60vh] max-w-[640px] w-full bg-slate-700 flex flex-col outline-none rounded-md">
          <Dialog.Close className=" absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form onSubmit={handleSaveNote} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex">
                {!shouldShowOnboarding ? (
                  <button
                    className="flex items-center text-sm font-medium text-slate-200 group hover:text-orange-400 transition-all"
                    onClick={() => setShouldShowOnboarding(true)}
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
                  <button className="font-medium text-orange-400 hover:underline">
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
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
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 py-4 text-center text-sm text-slate-200 font-medium outline-none group hover:bg-orange-600 transition-all"
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

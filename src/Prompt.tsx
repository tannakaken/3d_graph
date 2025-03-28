import { useCallback, useEffect, useRef, useState } from 'react';
import { createCallable } from 'react-call'

type Props = {
    message: string;
    defaultValue?: string;
}

type Response = string | undefined;

/**
 * Prompt dialog component
 */
export const Prompt = createCallable<Props, Response>(({call, message, defaultValue}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(true);
    console.warn(open);

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    const [response, setResponse] = useState<string | undefined>(defaultValue);

    useEffect(() => {
        console.warn(defaultValue);
        setResponse(defaultValue);
    }, [defaultValue]);

    const submit = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        setOpen(false);
        console.warn(response, 1);
        call.end(response);
        console.warn(response, 2);

    }, [response, call]);

    const cancel = useCallback(() => {
        setOpen(false);
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        call.end(undefined);
    }, [call]);



    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: ダイアログの外側をクリックしても閉じることができるようにするため、onClickを設定している。
        <dialog id="prompt"ref={dialogRef} className='prompt'onClick={cancel}>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: ダイアログの内側をクリックしたときにcancelが発動しないようにしている。 */}
            <div onClick={(e) => e.stopPropagation()}>
                <h2 id="prompt-description">{message}</h2>
                <div>
                    <input 
                        aria-describedby='prompt-description'
                        type="text"
                        value={response}
                        onChange={(event) => setResponse(event.target.value)}
                        onKeyDown={(event) => {
                            // submit when Enter key is pressed
                            if (event.key === 'Enter') {
                                submit();
                            }
                        }}
                    />
                </div>
                <div className='buttons'>
                    <button disabled={response===undefined} type="button" onClick={submit}>OK</button>
                    <button type="button" onClick={cancel}>Cancel</button>
                </div>
            </div>
        </dialog>
    );
});

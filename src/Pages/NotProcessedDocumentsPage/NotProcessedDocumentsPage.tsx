import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post } from "../../Services/ApiClient";
import { IRecognizedDocumentDto } from "../../Interfaces/IRecognizedDocumentDto";
import DocumentTable from "../../Components/DocumentTable";
import { Button } from "@mui/joy";
import { useState } from "react";

export default function NotProcessedDocumentsPage() {

    const queryClient = useQueryClient();

    const { data } = useQuery<IRecognizedDocumentDto[]>({
        queryKey: ['api/documents', 'hasProbability=false'],
        queryFn: () => get('api/documents', {
            params: {
                hasProbability: false
            }
        })
    })

    // Храним disabled состояние для каждого документа отдельно
    const [disabledButtons, setDisabledButtons] = useState<Map<number, boolean>>(new Map());

    const reprocess = useMutation({
        mutationKey: ['api/documents/reprocess'],
        mutationFn: (documentId: number) => post('api/documents/reprocess', documentId, {
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        onSuccess: (_, documentId) => {
            // Отключаем конкретную кнопку
            setDisabledButtons(prev => new Map(prev).set(documentId, true));
            
            // Включаем кнопку через 10 секунд
            setTimeout(() => {
                setDisabledButtons(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(documentId);
                    return newMap;
                });

                queryClient.invalidateQueries({
                    queryKey: ['api/documents']
                });
            }, 10 * 1000);
        },
        onError: (error, documentId) => {
            console.error('Reprocess failed:', error);
            // При ошибке тоже включаем кнопку обратно
            setDisabledButtons(prev => {
                const newMap = new Map(prev);
                newMap.delete(documentId);
                return newMap;
            });
        }
    })

    const onReprocess = (documentId: number) => {
        reprocess.mutate(documentId);
    }

    return (
        <DocumentTable 
            data={data!} 
            title="Необработанные файлы" 
            actions={(documentId: number) => {
                return (
                    <Button 
                        key={documentId} 
                        onClick={() => onReprocess(documentId)} 
                        disabled={disabledButtons.has(documentId) || reprocess.isPending}
                    >
                        {reprocess.isPending && reprocess.variables === documentId ? "Обработка..." : "Вернуть в обработку"}
                    </Button>
                )
            }}
        />
    )
}
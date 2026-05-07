import { Box, Stack, Table } from "@mui/joy";
import { Fragment, useEffect, useState } from "react";
import { IRecognizedDocumentDto } from "../Interfaces/IRecognizedDocumentDto";

export default function DocumentTable(props: { data: IRecognizedDocumentDto[], title: string}){

    const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());

    useEffect(() => {
        if (props.data) {
            const urls = new Map<number, string>();

            props.data.forEach(doc => {
                if (doc.fileBlob) {
                    try {
                        let blob: Blob;

                        if (typeof doc.fileBlob === 'string') {
                            // Определяем формат строки
                            if (doc.fileBlob.startsWith('data:')) {
                                // Это DataURL с префиксом
                                blob = dataURLtoBlob(doc.fileBlob);
                            } else {
                                // Это чистый base64 (ваш случай)
                                // Пытаемся определить MIME тип по началу строки
                                let mimeType = 'image/jpeg'; // по умолчанию
                                if (doc.fileBlob.startsWith('/9j/')) {
                                    mimeType = 'image/jpeg';
                                } else if (doc.fileBlob.startsWith('iVBOR')) {
                                    mimeType = 'image/png';
                                }
                                blob = base64ToBlob(doc.fileBlob, mimeType);
                            }
                        } else if (doc.fileBlob instanceof Blob) {
                            blob = doc.fileBlob;
                        } else {
                            console.warn('Unknown FileBlob format:', typeof doc.fileBlob);
                            return;
                        }

                        const url = URL.createObjectURL(blob);
                        urls.set(doc.documentId, url);
                    } catch (error) {
                        console.error('Error creating blob URL:', error, 'for doc:', doc.documentId);
                    }
                }
            });

            setImageUrls(urls);

            // Cleanup function
            return () => {
                urls.forEach(url => {
                    if (url.startsWith('blob:')) {
                        URL.revokeObjectURL(url);
                    }
                });
            };
        }
    }, [props.data]);

    // Конвертация чистого base64 в Blob
    const base64ToBlob = (base64String: string, mimeType: string = 'image/jpeg'): Blob => {
        try {
            // Декодируем base64 строку
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: mimeType });
        } catch (error) {
            console.error('Failed to decode base64:', error);
            throw error;
        }
    };

    // Конвертация DataURL в Blob
    const dataURLtoBlob = (dataURL: string): Blob => {
        const parts = dataURL.split(',');
        if (parts.length !== 2) {
            throw new Error('Invalid data URL format');
        }

        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

        const base64Data = parts[1];
        return base64ToBlob(base64Data, mime);
    };


    return (
        <Box sx={{ border: '1px solid #d0dae3', borderRadius: 8 }}>
            <Stack spacing={2}>
                {props.data &&
                    <Table aria-label="basic table" hoverRow>
                        <caption>{props.title}</caption>
                        <thead>
                            <tr>
                                <th style={{width: 50}}></th>
                                <th>Файл</th>
                                <th>Символ</th>
                                <th>Точность</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.data.map((row) => (
                                    <Fragment key={row.documentId}>
                                        <tr>
                                            <td rowSpan={row.recognitionResults.length || 1}>
                                                {imageUrls.get(row.documentId) && (
                                                    <img
                                                        src={imageUrls.get(row.documentId)}
                                                        alt={row.fileName}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                )}
                                            </td>
                                            <td rowSpan={row.recognitionResults.length || 1}>{row.fileName}</td>
                                            <td>{row.recognitionResults[0]?.label}</td>
                                            <td>{row.recognitionResults[0]?.probability}</td>
                                        </tr>
                                        {
                                            row.recognitionResults.slice(1).map((rr, idx) => (
                                                <tr key={`${row.documentId}-${idx}`}>
                                                    <td>{rr.label}</td>
                                                    <td>{rr.probability}</td>
                                                </tr>
                                            ))
                                        }
                                    </Fragment>
                                ))
                            }
                        </tbody>
                    </Table>
                }
            </Stack>
        </Box>
    )
}
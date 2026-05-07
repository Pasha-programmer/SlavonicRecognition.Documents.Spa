import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "../../Services/ApiClient";
import { IRecognizedDocumentDto } from "../../Interfaces/IRecognizedDocumentDto";
import DocumentTable from "../../Components/DocumentTable";

export default function QueuePage() {

    const queryClient = useQueryClient();

    const { data } = useQuery<IRecognizedDocumentDto[]>({
        queryKey: ['api/documents', 'hasProbability=false'],
        queryFn: () => get('api/documents', {
            params: {
                hasProbability: false
            }
        })
    }, queryClient)

    return (
        <DocumentTable data={data!} title="Необработанные файлы"/>
    )
}
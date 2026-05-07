import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "../../Services/ApiClient";
import { IRecognizedDocumentDto } from "../../Interfaces/IRecognizedDocumentDto";
import DocumentTable from "../../Components/DocumentTable";

export default function RecignizedDocumentsPage() {

    const queryClient = useQueryClient();

    const { data } = useQuery<IRecognizedDocumentDto[]>({
        queryKey: ['api/documents', 'hasProbability=true'],
        queryFn: () => get('api/documents', {
            params: {
                hasProbability: true
            }
        })
    }, queryClient)
    
    return (
        <DocumentTable data={data!} title="Распознанные документы"/>
    )
}
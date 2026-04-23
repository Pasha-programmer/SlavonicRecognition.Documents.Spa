import { Box, Stack, Table } from "@mui/joy";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get } from "../../Services/ApiClient";

export default function DocumentsPage(){

    const queryClient = useQueryClient();

    const { data } = useQuery<any[]>({
        queryKey: ['api/documents'],
        queryFn: () => get('api/documents')
    }, queryClient)

    return(
        <Box sx={{border: '1px solid #d0dae3', borderRadius: 8}}>
            <Stack spacing={2}>
                    {data &&
                        <Table aria-label="basic table" hoverRow>
                            <caption>Все документы</caption>
                            <thead>
                                <tr>
                                    <th>Файл</th>
                                    <th>Текст</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((row) => (
                                        <tr key={row.documentId}>
                                            <td>{row.fileName}</td>
                                            <td>{row.content}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }
                </Stack>
        </Box>
    )
}
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/joy';
import { post, get } from '../../Services/ApiClient';
import FileUpload from "react-mui-fileuploader"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfToday, startOfToday } from 'date-fns';
import Table from '@mui/joy/Table';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css'

export default function HomePage() {

    const [openCamera, setCamersState] = useState(false)
    const [files, setFiles] = useState([]);
    const handleChange = (files: []) => {
        setFiles([...files]);
    };

    const queryClient = useQueryClient();

    const upload = useMutation({
        mutationKey: ['api/documents/upload'],
        mutationFn: (formData: FormData) => post('api/documents/upload', formData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['api/documents']
            })
            setFiles([]);
        }
    }, queryClient)

    const { data } = useQuery<any[]>({
        queryKey: ['api/documents', startOfToday(), endOfToday()],
        queryFn: () => get('api/documents', {
            params: {
                fromDate: startOfToday(),
                toDate: endOfToday(),
            }
        })
    }, queryClient)

    const fileTypes = ["JPG", "PNG", "GIF"];

    const onUpload = async () => {

        const formData = new FormData()
        files.forEach((file) => formData.append("images", file))

        upload.mutate(formData)
    }

    const handleTakePhoto = (dataUri: string) => {

        fetch(dataUri).then(r => {
            
            if(r.status != 200)
                return;

            const formData = new FormData()

            r.blob().then(b =>{
                formData.append('images', b, "camera_photo_" + Date.now())
                upload.mutate(formData)
            })
        })
    }

    const handleCameraError = (error: any) => {
        console.log('handleCameraError', error);
    }


    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Box className='paper-outlined' sx={{ borderRadius: '50%', mb: 1, }}>
                    <Box className='camera-button'
                        component={'a'}
                        onClick={() => setCamersState(!openCamera)}
                        >
                        <Typography>
                            Камера
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {openCamera &&
                <Box className='paper-outlined' sx={{ mb: 1, }}>
                    
                        <Camera
                            onTakePhoto={(dataUri: any) => { handleTakePhoto(dataUri); }}
                            idealFacingMode={undefined}
                            imageType='jpg'
                            isFullscreen={false}
                            onCameraError={handleCameraError}
                        />
                </Box>
            }

            <Box className='drag-n-drop' >
                <FileUpload
                    onFilesChange={handleChange}
                    multiFile
                    title={null}
                    header="Перенесите"
                    leftLabel="или"
                    buttonLabel="выберите"
                    rightLabel="файлы"
                    buttonRemoveLabel="Удалить все"
                    acceptedType={'image/*'}
                    allowedExtensions={fileTypes}
                />
                <div className='actions'>
                    <Button onClick={onUpload}>
                        Обработать
                    </Button>
                </div>
            </Box>

            {(data?.length ?? 0) > 0 &&
                <Box sx={{ border: '1px solid #d0dae3', borderRadius: 8, mt: '10px' }}>
                    <Table aria-label="basic table" hoverRow>
                        <caption>История</caption>
                        <thead>
                            <tr>
                                <th>Файл</th>
                                <th>Текст</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data!.map((row) => (
                                    <tr key={row.documentId}>
                                        <td>{row.fileName}</td>
                                        <td>{row.content}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Box>
            }
        </>
    )
}
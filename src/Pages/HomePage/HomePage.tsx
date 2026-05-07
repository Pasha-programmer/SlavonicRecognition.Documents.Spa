import { useState } from 'react';
import { Box, Button, Typography } from '@mui/joy';
import { post, get } from '../../Services/ApiClient';
import FileUpload from "react-mui-fileuploader"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfToday, startOfToday } from 'date-fns';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css'
import { IRecognizedDocumentDto } from '../../Interfaces/IRecognizedDocumentDto';
import DocumentTable from '../../Components/DocumentTable';

export default function HomePage() {

    const [openCamera, setCameraState] = useState(false)
    const [files, setFiles] = useState<File[]>([]);
    const handleChangeFiles = (files: File[]) => {
        setFiles([...files]);
    };

    const [uploaderKey, setUploaderKey] = useState(0);

    const queryClient = useQueryClient();

    const upload = useMutation({
        mutationKey: ['api/documents/upload'],
        mutationFn: (formData: FormData) => post('api/documents/upload', formData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['api/documents']
            })

            handleChangeFiles([]);
            setUploaderKey(prev => prev + 1);
        },
        onError: (error) => {
            console.error('Upload failed:', error);
        }
    }, queryClient)

    const { data } = useQuery<IRecognizedDocumentDto[]>({
        queryKey: ['api/documents', startOfToday(), endOfToday()],
        queryFn: () => get('api/documents', {
            params: {
                fromDate: startOfToday(),
                toDate: endOfToday(),
            }
        })
    }, queryClient)

    const fileTypes = ["JPG", "PNG", "JPEG"];

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
                setCameraState(false);
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
                        onClick={() => setCameraState(!openCamera)}
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
                    key={uploaderKey}
                    files={files}
                    onFilesChange={handleChangeFiles}
                    multiFile
                    title={""}
                    header="Перенесите"
                    leftLabel="или"
                    buttonLabel="выберите"
                    rightLabel="файлы"
                    buttonRemoveLabel="Удалить все"
                    acceptedType={'image/*'}
                    allowedExtensions={fileTypes}
                    showPlaceholderImage={false}
                />
                <div className='actions'>
                    <Button onClick={onUpload} disabled={files.length === 0}>
                        Обработать
                    </Button>
                </div>
            </Box>

            <DocumentTable data={data!} title="История на сегодня"/>
        </>
    )
}
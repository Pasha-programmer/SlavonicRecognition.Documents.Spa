import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import DocumentsPage from "../Pages/DocumentsPage/DocumentsPage";
import RecignizedDocumentsPage from "../Pages/RecignizedDocumentsPage/RecignizedDocuments";
import NotProcessedDocumentsPage from "../Pages/NotProcessedDocumentsPage/NotProcessedDocumentsPage";
import { RoutePaths } from "../Constants/RoutePaths";

export default function Router(){
    
    return (
        <Routes>

            {/* private routes */}
            <Route path="/" element={<HomePage />} />
            <Route path={RoutePaths.Home} element={<HomePage />} />
            <Route path={RoutePaths.Documents} element={<DocumentsPage />} />
            <Route path={RoutePaths.RecognizedDocuments} element={<RecignizedDocumentsPage />} />
            <Route path={RoutePaths.NotProcessedDocuments} element={<NotProcessedDocumentsPage />} />
        </Routes>
    )
}
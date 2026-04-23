import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import DocumentsPage from "../Pages/DocumentsPage/DocumentsPage";
import RecignizedDocumentsPage from "../Pages/RecignizedDocumentsPage/RecignizedDocuments";
import QueuePage from "../Pages/QueuePage/QueuePage";
import { RoutePaths } from "../Constants/RoutePaths";

export default function Router(){
    
    return (
        <Routes>

            {/* private routes */}
            <Route path="/" element={<HomePage />} />
            <Route path={RoutePaths.Home} element={<HomePage />} />
            <Route path={RoutePaths.Documents} element={<DocumentsPage />} />
            <Route path={RoutePaths.RecignizedDocuments} element={<RecignizedDocumentsPage />} />
            <Route path={RoutePaths.Queue} element={<QueuePage />} />
        </Routes>
    )
}
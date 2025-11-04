import { Route, Routes } from 'react-router-dom'
import '@/App.css'
import HomePages from '@/pages/HomePage'
import CommunityPage from '@/pages/CommunityPage'
import DocumentPage from '@/pages/DocumentPage'

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<HomePages/>}/>
            <Route path={"/komunitas"} element={<CommunityPage/>}/>
            <Route path={'/dokumen'} element={<DocumentPage/>}/>
        </Routes>
    )
}

export default App

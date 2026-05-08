import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AIWorkspace } from './pages/ai-workspace/AIWorkspace';
import { ProjectWorkspace } from './pages/project-workspace/ProjectWorkspace';
import { SetupWizard } from './pages/setup-wizard/SetupWizard';
import { Settings } from './pages/settings/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<SetupWizard />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workspace/:projectId" element={<AIWorkspace />} />
          <Route path="/workspace/:projectId/editor" element={<ProjectWorkspace />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

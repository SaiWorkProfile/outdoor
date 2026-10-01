import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProjectModeClient } from '@/components/calculators/ProjectModeClient';

export const metadata = {title:'Project Mode',description:'Combine outdoor calculator results into one project plan and shopping list.',alternates:{canonical:'/projects'}};

export default function ProjectsPage(){return <><div className="container" style={{paddingTop:24}}><Breadcrumbs items={[{label:'Projects'}]}/></div><ProjectModeClient/></>}

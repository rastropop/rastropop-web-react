// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome,
    IconHelp,
    IconSitemap
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'Dashboard',
            title: <FormattedMessage id="Dashboard" />,
            type: 'item',
            url: '/dashboard',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'Pontosdeparada',
            title: <FormattedMessage id="Pontos de parada" />,
            type: 'item',
            url: '/pontosDeParada',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'Horimetro',
            title: <FormattedMessage id="Horimetro" />,
            type: 'item',
            url: '/horimetro',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        }
    ]
};

export default other;

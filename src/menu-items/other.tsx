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
            id: 'MinhaConta',
            title: <FormattedMessage id="Minha Conta" />,
            type: 'item',
            url: '/profile',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'PontosDeParada',
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
        },
        {
            id: 'Trajetos',
            title: <FormattedMessage id="Trajetos" />,
            type: 'item',
            url: '/trajetos',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'VelocidadeExcedida',
            title: <FormattedMessage id="Velocidade Excedida" />,
            type: 'item',
            url: '/velocidadeExcedida',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'ZonaDeInteresse',
            title: <FormattedMessage id="Zona de interesse" />,
            type: 'item',
            url: '/zonaDeInteresse',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'Dashboard',
            title: <FormattedMessage id="Dashboard" />,
            type: 'item',
            url: '/dashboard',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'Historico',
            title: <FormattedMessage id="Historico de posições" />,
            type: 'item',
            url: '/historicoDePosicoes',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'Localizar',
            title: <FormattedMessage id="Localizar" />,
            type: 'item',
            url: '/localizar',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        }
    ]
};

export default other;

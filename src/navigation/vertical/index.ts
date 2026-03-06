export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Usuários',
    icon: { icon: 'tabler-users-group' },
    to: 'users',
    action: 'list',
    subject: 'users',
  },
  {
    title: 'Controle de Acesso',
    icon: { icon: 'tabler-smart-home' },
    children: [
      { title: 'Perfis', to: 'acesso-perfis' },
      { title: 'Permissões', to: 'acesso-permissoes' },
    ],
  },
  {
    title: 'Fabricante',
    icon: { icon: 'tabler-building-factory-2' },
    to: 'fabricante',
    action: 'list',
    subject: 'fabricante',
  },
  {
    title: 'Loja',
    icon: { icon: 'tabler-building-store' },
    to: 'loja',
    action: 'list',
    subject: 'loja',
  },
  {
    title: 'Produto',
    icon: { icon: 'tabler-brand-producthunt' },
    to: 'produto',
    action: 'list',
    subject: 'produto',
  },
  {
    title: 'Promocao',
    icon: { icon: 'tabler-tags-off' },
    to: 'promocao',
    action: 'list',
    subject: 'promocao',
  },
]

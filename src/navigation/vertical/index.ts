export default [
  {
    title: 'Área do Professor',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Área do Aluno',
    icon: { icon: 'tabler-school' },
    children: [
      { title: 'Progresso', to: 'academy-dashboard' },
      { title: 'Meus Cursos', to: 'academy-my-course' },
      { title: 'Detalhes do Curso', to: 'academy-course-details' },
    ],
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

]

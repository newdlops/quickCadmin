import React from 'react'
import AppMenuitem from './AppMenuitem'
import { MenuProvider } from './context/menucontext'
import { AppMenuItem } from '../types/types'

const AppMenu = () => {
  const model: AppMenuItem[] = [
    // {
    //   label: 'Home',
    //   items: [{ label: '메인화면', icon: 'pi pi-fw pi-home', to: '/', target: '_self' }],
    // },
    {
      label: '공지사항 관리',
      items: [{ label: '공지사항관리', icon: 'pi pi-fw pi-megaphone', to: '/notice', target: '_self' }],
    },
    {
      label: '자주하는 질문 관리',
      items: [{ label: 'FAQ관리', icon: 'pi pi-fw pi-comments', to: '/faq', target: '_self' }],
    },
    {
      label: '유저관리',
      items: [{ label: '유저관리', icon: 'pi pi-fw pi-user', to: '/user' }],
    },
    {
      label: '제품관리',
      items: [
        { label: '제품관리', icon: 'pi pi-fw pi-box', to: '/product' },
        { label: '필요문서관리', icon: 'pi pi-fw pi-file', to: '/documents' },
        { label: '시험소관리', icon: 'pi pi-fw pi-box', to: '/laboratory' },
        { label: '정보추가 요청내역', icon: 'pi pi-fw pi-comment', to: '/requestinfo' },
        { label: '잘못된 정보 신고내역', icon: 'pi pi-fw pi-bell', to: '/wronginfo' },
      ],
    },
    {
      label: '프로젝트관리',
      items: [
        { label: '프로젝트리스트', icon: 'pi pi-fw pi-briefcase', to: '/project' },
        { label: '프로젝트상세', icon: 'pi pi-fw pi-briefcase', to: '/project/projectdetail' },
      ],
    },
    // {
    //   label: 'UI Components',
    //   items: [
    //     { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
    //     { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
    //     { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
    //     { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
    //     { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //     { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //     { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
    //     { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //     { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
    //     { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
    //     { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
    //     { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
    //     { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
    //     { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
    //     { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //     { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' },
    //   ],
    // },
    // {
    //   label: 'Prime Blocks',
    //   items: [
    //     { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
    //     { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://blocks.primereact.org', target: '_blank' },
    //   ],
    // },
    // {
    //   label: 'Utilities',
    //   items: [
    //     { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
    //     { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://primeflex.org/', target: '_blank' },
    //   ],
    // },
    // {
    //   label: 'Pages',
    //   icon: 'pi pi-fw pi-briefcase',
    //   to: '/pages',
    //   items: [
    //     {
    //       label: 'Landing',
    //       icon: 'pi pi-fw pi-globe',
    //       to: '/landing',
    //     },
    //     {
    //       label: 'Auth',
    //       icon: 'pi pi-fw pi-user',
    //       items: [
    //         {
    //           label: 'Login',
    //           icon: 'pi pi-fw pi-sign-in',
    //           to: '/auth/login',
    //         },
    //         {
    //           label: 'Error',
    //           icon: 'pi pi-fw pi-times-circle',
    //           to: '/auth/error',
    //         },
    //         {
    //           label: 'Access Denied',
    //           icon: 'pi pi-fw pi-lock',
    //           to: '/auth/access',
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Crud',
    //       icon: 'pi pi-fw pi-pencil',
    //       to: '/pages/crud',
    //     },
    //     {
    //       label: 'Timeline',
    //       icon: 'pi pi-fw pi-calendar',
    //       to: '/pages/timeline',
    //     },
    //     {
    //       label: 'Not Found',
    //       icon: 'pi pi-fw pi-exclamation-circle',
    //       to: '/pages/notfound',
    //     },
    //     {
    //       label: 'Empty',
    //       icon: 'pi pi-fw pi-circle-off',
    //       to: '/pages/empty',
    //     },
    //   ],
    // },
    // {
    //   label: 'Hierarchy',
    //   items: [
    //     {
    //       label: 'Submenu 1',
    //       icon: 'pi pi-fw pi-bookmark',
    //       items: [
    //         {
    //           label: 'Submenu 1.1',
    //           icon: 'pi pi-fw pi-bookmark',
    //           items: [
    //             { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //             { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //             { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
    //           ],
    //         },
    //         {
    //           label: 'Submenu 1.2',
    //           icon: 'pi pi-fw pi-bookmark',
    //           items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
    //         },
    //       ],
    //     },
    //     {
    //       label: 'Submenu 2',
    //       icon: 'pi pi-fw pi-bookmark',
    //       items: [
    //         {
    //           label: 'Submenu 2.1',
    //           icon: 'pi pi-fw pi-bookmark',
    //           items: [
    //             { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
    //             { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
    //           ],
    //         },
    //         {
    //           label: 'Submenu 2.2',
    //           icon: 'pi pi-fw pi-bookmark',
    //           items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   label: 'Get Started',
    //   items: [
    //     {
    //       label: 'Documentation',
    //       icon: 'pi pi-fw pi-question',
    //       to: '/documentation',
    //     },
    //     {
    //       label: 'View Source',
    //       icon: 'pi pi-fw pi-search',
    //       url: 'https://github.com/primefaces/sakai-react',
    //       target: '_blank',
    //     },
    //   ],
    // },
  ]

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => (!item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>))}
      </ul>
    </MenuProvider>
  )
}

export default AppMenu

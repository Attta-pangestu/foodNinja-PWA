document.addEventListener('DOMContentLoaded', () => {
    // nav menu
    const menu = document.querySelector('#side-menu') ; 
    M.Sidenav.init(menu, {edge: 'right'} )

    const form = document.querySelector('#side-form') ; 
    M.Sidenav.init(form, {edge : 'left'}) ; 
});


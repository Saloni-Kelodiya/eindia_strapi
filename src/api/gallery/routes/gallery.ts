export default {
  routes: [
    { method: 'GET', path: '/galleries', handler: 'gallery.find' },
    { method: 'GET', path: '/galleries/:id', handler: 'gallery.findOne' },
    { method: 'POST', path: '/galleries', handler: 'gallery.create' },
    { method: 'PUT', path: '/galleries/:id', handler: 'gallery.update' },
    { method: 'DELETE', path: '/galleries/:id', handler: 'gallery.delete' },
  ],
};

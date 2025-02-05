import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';

// routes config
import routes from '../routes';

const AppContent = () => {
  const token = localStorage.getItem('authToken');
  console.log('Retrieved Token:', token);

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            console.log('route: ' + JSON.stringify(route, null, 2));
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    token ? (
                      <route.element />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
              )
            );
          })}

          {/* Default route based on token */}
          {token ? (
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          ) : (
            <Route path="/" element={<Navigate to="login" replace />} />
          )}
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);

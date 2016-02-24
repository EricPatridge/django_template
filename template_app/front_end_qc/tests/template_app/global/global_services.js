describe("Tests for global services", function(){
    "use strict";
    beforeEach(module("template_app"));
    var $rootScope;
    
    describe("Tests for the retrieveUser service", function() {
        var the_q;
        var retrieveUserService;
        var returnedObjects;
        var userResource = {'get': function() {}};
        
        beforeEach(module(function($provide) {
            $provide.value("User", userResource);
        }));
        
        beforeEach(inject(function(retrieveUser, $q, _$rootScope_) {
            retrieveUserService = retrieveUser;
            the_q = $q;
            $rootScope = _$rootScope_;
            returnedObjects = [];
            spyOn(userResource, 'get').and.returnValue({'$promise': the_q.when({'objects': returnedObjects})});
        }));
        
        it("assigns info to userholder when 1 object is returned", function() {
            returnedObjects.push({'username': 'a', 'email': 'b'});
            var retval = {};
            retrieveUserService(retval);
            expect(retval).toEqual({});
            $rootScope.$digest();
            expect(retval).toEqual({'username': 'a',
                                    'email': 'b',
                                    'the_obj': {'username': 'a', 'email': 'b'}});
            expect(userResource.get).toHaveBeenCalled();
        });

        it("sets stuff to empty when some number of objects other then 1 is returned", function() {
            var retval = {'username': 'a', 'email': 'b', 'the_obj': 'c'};
            retrieveUserService(retval);
            expect(retval).toEqual({'username': 'a', 'email': 'b', 'the_obj': 'c'});
            $rootScope.$digest();
            expect(retval).toEqual({'username': '', 'email': '', 'the_obj': null});
            expect(userResource.get).toHaveBeenCalled();
        });
    });
    
    describe("Tests for the djangoLogin service", function() {
        var djangoLoginService;
        var httpBackend;
        var retrieveUser;
        
        beforeEach(module(function($provide) {
            retrieveUser = jasmine.createSpy('retrieveUser');
            $provide.value("retrieveUser", retrieveUser);
        }));
        
        beforeEach(inject(function (djangoLogin, $httpBackend) {
            djangoLoginService = djangoLogin;
            httpBackend = $httpBackend;
        }));
        
        it("Calls retrieveUser on 200 from http login.", function() {
            httpBackend.expectPOST('/login_async/', {'username': 'a',
                                                     'password': 'b'}).respond(200, {'status_code': '200'});
            djangoLoginService('a', 'b', {});
            httpBackend.flush();
            expect(retrieveUser).toHaveBeenCalled();
        });
        
        it("Harmlessly passes through on any other status code", function() {
            httpBackend.expectPOST('/login_async/', {'username': 'a',
                                                     'password': 'b'}).respond(200, {'status_code': '401'});
            djangoLoginService('a', 'b', {});
            httpBackend.flush();
            expect(retrieveUser).not.toHaveBeenCalled();
        });
    });
    
    describe("Tests for the djangoLogout service", function() {
        var djangoLogoutService;
        var httpBackend;
        var retrieveUser;
        
        beforeEach(module(function($provide) {
            retrieveUser = jasmine.createSpy('retrieveUser');
            $provide.value("retrieveUser", retrieveUser);
        }));
        
        beforeEach(inject(function (djangoLogout, $httpBackend) {
            djangoLogoutService = djangoLogout;
            httpBackend = $httpBackend;
        }));
        
        it("Calls retrieveUser on 200 from http login.", function() {
            httpBackend.expectGET('/logout_async/').respond(200, {'status': 'logout success'});
            djangoLogoutService({});
            httpBackend.flush();
            expect(retrieveUser).toHaveBeenCalledWith({});
        });
    });
    
    describe("tests for the saveAndGet service", function() {
        var $httpBackend;
        var saveAndGetService;
        var saveMethod;
        var headersMethod;
        var $q;
        var retval;
        
        beforeEach(inject(function (saveAndGet, _$httpBackend_, _$q_) {
            saveAndGetService = saveAndGet;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
        }));
        
        it("calls http get on location header after invoking save method", function() {
            saveMethod = jasmine.createSpy('saveMethod').and.returnValue({'$promise': $q.when(true)});
            headersMethod = jasmine.createSpy('headersMethod').and.returnValue('/test_url/');
            
            saveAndGetService(saveMethod, {}).then(function(data) {
                retval = data.data;
            });
            expect(saveMethod).toHaveBeenCalled();
            $httpBackend.expectGET('invalid').respond(200, {'good': 'times'});
            $rootScope.$digest();
            $httpBackend.flush();
            expect(retval.good).toEqual('times');
            
            // headers aren't forwarded with a regular $promise.then, so gotta get creative
            // to get at the inner method.
            expect(headersMethod).not.toHaveBeenCalled();
            saveMethod.calls.first().args[1]({}, headersMethod);
            expect(headersMethod).toHaveBeenCalled();
        });
    });
});
export namespace main {
	
	export class TestCase {
	    Headers: Record<string, string>;
	    Body: Record<string, any>;
	    QueryParams: Record<string, any>;
	    APIResponse: any;
	    Method: string;
	    Url: string;
	    Id: number;
	
	    static createFrom(source: any = {}) {
	        return new TestCase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Headers = source["Headers"];
	        this.Body = source["Body"];
	        this.QueryParams = source["QueryParams"];
	        this.APIResponse = source["APIResponse"];
	        this.Method = source["Method"];
	        this.Url = source["Url"];
	        this.Id = source["Id"];
	    }
	}

}


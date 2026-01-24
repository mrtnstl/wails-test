export namespace main {
	
	export class TestCase {
	    Id: number;
	    Method: string;
	    Url: string;
	
	    static createFrom(source: any = {}) {
	        return new TestCase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Method = source["Method"];
	        this.Url = source["Url"];
	    }
	}

}

